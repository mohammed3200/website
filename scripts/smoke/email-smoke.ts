/**
 * Task 2 — Email transport smoke test
 *
 * Proves a single message leaves the SMTP server using the real transport
 * configured in src/lib/email/transports/nodemailer.ts.
 *
 * Run with:   bun run scripts/smoke/email-smoke.ts
 *
 * Required env (read from .env.test by default):
 *   SMTP_HOST  SMTP_PORT  SMTP_SECURE  SMTP_USER  SMTP_PASS  EMAIL_FROM
 *   SMOKE_TEST_INBOX  -- required, aborts if missing
 *
 * Verification:
 *   - transport.verify() returns true
 *   - sendMail returns a Message-ID
 *   - Mailpit HTTP API at MAILPIT_API_URL (default http://127.0.0.1:8025) shows
 *     the message with the same Message-ID within 60 s.
 *
 * Idempotent: each run sends one fresh message; the script polls for that
 *   specific Message-ID, so re-runs do not collide.
 */
import { hostname } from 'node:os';
import { setTimeout as sleep } from 'node:timers/promises';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.test') });

import { createNodemailerTransport } from '@/lib/email/transports/nodemailer';

const MAILPIT_API_URL =
  process.env.MAILPIT_API_URL || 'http://127.0.0.1:8025';
const RETRY_BUDGET_MS = 60_000;
const POLL_INTERVAL_MS = 500;

type Verdict = 'GREEN' | 'YELLOW' | 'RED';
type FailureMode =
  | 'AUTH'
  | 'CONN'
  | 'TLS'
  | 'DNS'
  | 'RATELIMIT'
  | 'TEMPLATE'
  | 'OTHER';

function classifyFailure(err: unknown): FailureMode {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err);
  if (msg.includes('eauth') || msg.includes('invalid login')) return 'AUTH';
  if (msg.includes('econnrefused') || msg.includes('econnreset'))
    return 'CONN';
  if (msg.includes('tls') || msg.includes('ssl')) return 'TLS';
  if (msg.includes('enotfound') || msg.includes('dns')) return 'DNS';
  if (msg.includes('421') || msg.includes('throttle') || msg.includes('limit'))
    return 'RATELIMIT';
  if (msg.includes('template') || msg.includes('render')) return 'TEMPLATE';
  return 'OTHER';
}

interface MailpitMessageSummary {
  ID: string;
  MessageID: string;
  From: { Address: string; Name: string };
  To: Array<{ Address: string; Name: string }>;
  Subject: string;
  Created: string;
}

interface MailpitListResponse {
  total: number;
  unread: number;
  count: number;
  start: number;
  messages: MailpitMessageSummary[];
}

async function findInMailpit(
  expectedMessageId: string,
): Promise<MailpitMessageSummary | null> {
  const trimmed = expectedMessageId.replace(/^<|>$/g, '');
  const res = await fetch(`${MAILPIT_API_URL}/api/v1/messages?limit=50`);
  if (!res.ok) return null;
  const body = (await res.json()) as MailpitListResponse;
  return (
    body.messages.find(
      (m) =>
        m.MessageID === expectedMessageId ||
        m.MessageID === trimmed ||
        `<${m.MessageID}>` === expectedMessageId,
    ) || null
  );
}

async function main() {
  const inbox = process.env.SMOKE_TEST_INBOX;
  if (!inbox) {
    console.error('❌ SMOKE_TEST_INBOX is required. Aborting.');
    process.exit(2);
  }

  console.log('━━━ Task 2 — Email transport smoke test ━━━');
  console.log(`SMTP host : ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  console.log(
    `SMTP user : ${process.env.SMTP_USER ? '***present***' : '(none)'}`,
  );
  console.log(`From      : ${process.env.EMAIL_FROM}`);
  console.log(`To        : ${inbox}`);
  console.log(`Mailpit   : ${MAILPIT_API_URL}`);
  console.log('');

  const transport = createNodemailerTransport();

  // 1. transport.verify()
  let verifyOk = false;
  try {
    verifyOk = await transport.verify();
    console.log(`✓ transport.verify() = ${verifyOk}`);
  } catch (err) {
    const mode = classifyFailure(err);
    console.error(`✗ transport.verify() FAILED [${mode}]:`, err);
    finalize('RED', mode);
    process.exit(1);
  }

  // 2. sendMail()
  const ts = new Date().toISOString();
  const subject = `[EITDC SMOKE] ${ts}`;
  const text = `smoke test from ${hostname()} at ${ts}`;
  const html = `<p dir="auto">${text}</p>`;
  let messageId = '';

  try {
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: inbox,
      subject,
      text,
      html,
    });
    messageId = info.messageId || '';
    console.log('✓ sendMail() resolved');
    console.log(`  messageId : ${messageId}`);
    console.log(`  response  : ${info.response}`);
    console.log(`  accepted  : ${JSON.stringify(info.accepted)}`);
    console.log(`  rejected  : ${JSON.stringify(info.rejected)}`);
  } catch (err) {
    const mode = classifyFailure(err);
    console.error(`✗ sendMail() FAILED [${mode}]:`, err);
    finalize('RED', mode);
    process.exit(1);
  }

  if (!messageId) {
    console.error('✗ Empty Message-ID returned by transport');
    finalize('RED', 'OTHER');
    process.exit(1);
  }

  // 3. Poll Mailpit for the same Message-ID
  const deadline = Date.now() + RETRY_BUDGET_MS;
  let found: MailpitMessageSummary | null = null;
  while (Date.now() < deadline) {
    found = await findInMailpit(messageId);
    if (found) break;
    await sleep(POLL_INTERVAL_MS);
  }

  if (!found) {
    console.error(
      `✗ Message ${messageId} not observed in Mailpit within ${RETRY_BUDGET_MS / 1000}s`,
    );
    finalize('RED', 'OTHER');
    process.exit(1);
  }

  console.log('✓ Mailpit observed the Message-ID');
  console.log(`  inbox.ID    : ${found.ID}`);
  console.log(`  inbox.From  : ${found.From.Address}`);
  console.log(`  inbox.To    : ${found.To.map((t) => t.Address).join(', ')}`);
  console.log(`  inbox.Subj  : ${found.Subject}`);
  console.log('');

  finalize('GREEN');
  process.exit(0);
}

function finalize(verdict: Verdict, mode?: FailureMode) {
  console.log('━━━ verdict ━━━');
  if (verdict === 'GREEN') console.log('🟢 GREEN — email left transport and arrived');
  else if (verdict === 'YELLOW') console.log(`🟡 YELLOW — ${mode}`);
  else console.log(`🔴 RED — ${mode}`);
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  finalize('RED', 'OTHER');
  process.exit(1);
});
