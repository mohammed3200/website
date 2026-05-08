/**
 * Task 3 — Email template rendering (AR + EN, RTL safe)
 *
 * For every template surfaced via src/lib/email/templates/index.ts:
 *   1. Render in 'ar' and 'en'
 *   2. Write the HTML to /tmp/eitdc-email-preview/{locale}/{name}.html
 *   3. Run programmatic checks:
 *        a. <html dir="rtl"> for ar / dir="ltr" for en
 *        b. The official center name (AR + EN) is present
 *        c. No literal {{ or }} left unsubstituted
 *        d. Every <img src> uses an absolute URL (http(s)://)
 *   4. Send a test message of each rendered template to SMOKE_TEST_INBOX
 *      with subject prefix [EITDC TEMPLATE TEST {locale} {name}]
 *
 * Run with:   bun run scripts/smoke/email-template-preview.ts
 *
 * Idempotent: HTML files are overwritten on each run; Mailpit captures
 * every send but is local-only, so re-runs do not affect any real inbox.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.test') });

import {
  renderSubmissionConfirmation,
  renderStatusUpdate,
  renderPasswordReset,
  renderWelcome,
  renderTwoFactorAuth,
  renderEmailVerification,
  renderAdminNotification,
} from '@/lib/email/templates';
import { createNodemailerTransport } from '@/lib/email/transports/nodemailer';

const PREVIEW_DIR = '/tmp/eitdc-email-preview';
const CENTER_NAME_AR =
  'مركز ريادة الأعمال وحاضنات الأعمال - مصراتة';
const CENTER_NAME_EN =
  'Entrepreneurship and Business Incubators Center - Misurata';

type Locale = 'ar' | 'en';

interface TemplateCase {
  name: string;
  render: (locale: Locale) => Promise<string>;
}

const FIXTURE = {
  name: 'Test Recipient',
  email: process.env.SMOKE_TEST_INBOX || 'smoke@eitdc.test',
  resetLink: 'https://ebic.cit.edu.ly/auth/reset?token=fixture-token',
  verificationLink:
    'https://ebic.cit.edu.ly/auth/verify?token=fixture-token',
  loginLink: 'https://ebic.cit.edu.ly/auth/login',
  role: 'admin',
  code: '123456',
};

const TEMPLATES: TemplateCase[] = [
  {
    name: 'SubmissionConfirmation',
    render: (locale) =>
      renderSubmissionConfirmation({
        name: FIXTURE.name,
        type: 'innovator',
        locale,
        submissionId: 'fixture-submission-id',
      }),
  },
  {
    name: 'StatusUpdate',
    render: (locale) =>
      renderStatusUpdate({
        name: FIXTURE.name,
        type: 'collaborator',
        status: 'approved',
        locale,
        nextSteps: locale === 'ar' ? ['الخطوة الأولى'] : ['Step one'],
      }),
  },
  {
    name: 'PasswordReset',
    render: (locale) =>
      renderPasswordReset({
        name: FIXTURE.name,
        resetLink: FIXTURE.resetLink,
        locale,
        expiresIn: locale === 'ar' ? 'ساعة واحدة' : '1 hour',
      }),
  },
  {
    name: 'Welcome',
    render: (locale) =>
      renderWelcome({
        name: FIXTURE.name,
        role: FIXTURE.role,
        loginLink: FIXTURE.loginLink,
        locale,
      }),
  },
  {
    name: 'TwoFactorAuth',
    render: (locale) =>
      renderTwoFactorAuth({
        name: FIXTURE.name,
        code: FIXTURE.code,
        locale,
        expiresIn: locale === 'ar' ? '10 دقائق' : '10 minutes',
      }),
  },
  {
    name: 'EmailVerification',
    render: (locale) =>
      renderEmailVerification({
        name: FIXTURE.name,
        verificationLink: FIXTURE.verificationLink,
        locale,
        expiresIn: locale === 'ar' ? '24 ساعة' : '24 hours',
      }),
  },
  {
    name: 'AdminNotification',
    render: (locale) =>
      renderAdminNotification({
        adminName: FIXTURE.name,
        title: locale === 'ar' ? 'إشعار إداري' : 'Admin Notice',
        message:
          locale === 'ar'
            ? 'هذه رسالة اختبار لقالب الإشعارات الإدارية.'
            : 'This is a test of the admin notification template.',
        actionUrl: 'https://ebic.cit.edu.ly/admin',
        locale,
      }),
  },
];

interface CheckResult {
  template: string;
  locale: Locale;
  htmlPath: string;
  htmlBytes: number;
  checks: {
    direction: { ok: boolean; detail: string };
    centerName: { ok: boolean; detail: string };
    noUnsubstituted: { ok: boolean; detail: string };
    absoluteImages: { ok: boolean; detail: string };
  };
  delivered: { ok: boolean; messageId?: string; error?: string };
}

function checkDirection(html: string, locale: Locale): {
  ok: boolean;
  detail: string;
} {
  const expected = locale === 'ar' ? 'rtl' : 'ltr';
  const re = new RegExp(`<html[^>]*\\bdir=["']?${expected}["']?`, 'i');
  if (re.test(html)) return { ok: true, detail: `dir="${expected}" present` };
  return {
    ok: false,
    detail: `expected dir="${expected}" on <html> tag, not found`,
  };
}

function checkCenterName(html: string, locale: Locale): {
  ok: boolean;
  detail: string;
} {
  const expected = locale === 'ar' ? CENTER_NAME_AR : CENTER_NAME_EN;
  if (html.includes(expected)) {
    return { ok: true, detail: `center name present (${expected.length} chars)` };
  }
  return {
    ok: false,
    detail: `expected substring not found: "${expected}"`,
  };
}

function checkNoUnsubstituted(html: string): { ok: boolean; detail: string } {
  // Allow legitimate {{ in CSS like url("{{...}}"), but flag bare handlebars-style placeholders.
  const matches = html.match(/\{\{[\s\S]*?\}\}/g);
  if (!matches || matches.length === 0)
    return { ok: true, detail: 'no {{...}} placeholders' };
  return {
    ok: false,
    detail: `found ${matches.length} unsubstituted placeholder(s): ${matches
      .slice(0, 3)
      .join(', ')}`,
  };
}

function checkAbsoluteImages(html: string): { ok: boolean; detail: string } {
  const imgs = [...html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)];
  if (imgs.length === 0) return { ok: true, detail: 'no <img> tags' };
  const offenders = imgs
    .map((m) => m[1])
    .filter(
      (src) =>
        !/^https?:\/\//i.test(src) &&
        !/^data:/i.test(src) &&
        !/^cid:/i.test(src),
    );
  if (offenders.length === 0)
    return {
      ok: true,
      detail: `${imgs.length} image(s), all absolute`,
    };
  return {
    ok: false,
    detail: `relative <img src>: ${offenders.slice(0, 3).join(', ')}`,
  };
}

async function main() {
  mkdirSync(`${PREVIEW_DIR}/ar`, { recursive: true });
  mkdirSync(`${PREVIEW_DIR}/en`, { recursive: true });

  const transport = createNodemailerTransport();
  await transport.verify();

  const results: CheckResult[] = [];

  for (const tpl of TEMPLATES) {
    for (const locale of ['ar', 'en'] as Locale[]) {
      const html = await tpl.render(locale);
      const htmlPath = `${PREVIEW_DIR}/${locale}/${tpl.name}.html`;
      writeFileSync(htmlPath, html, 'utf8');

      const checks = {
        direction: checkDirection(html, locale),
        centerName: checkCenterName(html, locale),
        noUnsubstituted: checkNoUnsubstituted(html),
        absoluteImages: checkAbsoluteImages(html),
      };

      let delivered: CheckResult['delivered'];
      try {
        const info = await transport.sendMail({
          from: process.env.EMAIL_FROM,
          to: FIXTURE.email,
          subject: `[EITDC TEMPLATE TEST ${locale} ${tpl.name}]`,
          html,
        });
        delivered = { ok: true, messageId: info.messageId };
      } catch (err) {
        delivered = {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }

      results.push({
        template: tpl.name,
        locale,
        htmlPath,
        htmlBytes: html.length,
        checks,
        delivered,
      });
    }
  }

  // Print report
  console.log('━━━ Task 3 — Template rendering report ━━━\n');
  let pass = 0;
  let fail = 0;
  for (const r of results) {
    const allOk =
      r.checks.direction.ok &&
      r.checks.centerName.ok &&
      r.checks.noUnsubstituted.ok &&
      r.checks.absoluteImages.ok &&
      r.delivered.ok;
    const tag = allOk ? '✓' : '✗';
    if (allOk) pass++;
    else fail++;
    console.log(
      `${tag} ${r.template} [${r.locale}]  ${r.htmlBytes}B  →  ${r.htmlPath}`,
    );
    console.log(`    direction        ${r.checks.direction.ok ? '✓' : '✗'} ${r.checks.direction.detail}`);
    console.log(`    centerName       ${r.checks.centerName.ok ? '✓' : '✗'} ${r.checks.centerName.detail}`);
    console.log(`    noUnsubstituted  ${r.checks.noUnsubstituted.ok ? '✓' : '✗'} ${r.checks.noUnsubstituted.detail}`);
    console.log(`    absoluteImages   ${r.checks.absoluteImages.ok ? '✓' : '✗'} ${r.checks.absoluteImages.detail}`);
    console.log(
      `    delivered        ${r.delivered.ok ? '✓' : '✗'} ${
        r.delivered.ok ? r.delivered.messageId : r.delivered.error
      }`,
    );
  }

  console.log('');
  console.log(`Summary: ${pass} pass / ${fail} fail (out of ${results.length})`);

  let verdict: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  const missingLocales = TEMPLATES.filter((t) => {
    const ar = results.find((r) => r.template === t.name && r.locale === 'ar');
    const en = results.find((r) => r.template === t.name && r.locale === 'en');
    return !ar || !en;
  });
  if (missingLocales.length > 0) verdict = 'YELLOW';
  if (fail > 0) verdict = 'RED';

  console.log('');
  console.log('━━━ verdict ━━━');
  if (verdict === 'GREEN') console.log('🟢 GREEN — every template passed every check');
  else if (verdict === 'YELLOW') console.log('🟡 YELLOW — bilingual variants missing');
  else console.log('🔴 RED — at least one template failed substitution / direction / font / delivery');

  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
