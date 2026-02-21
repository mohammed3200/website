/**
 * WhatsApp Integration Test Script
 * ---------------------------------
 * Tests the full messaging pipeline:
 *   1. Direct message sending (plain text)
 *   2. Template message (DB-driven)
 *   3. Queue flow (BullMQ → worker)
 *
 * PREREQUISITE: Set env vars before running:
 *   WHATSAPP_API_URL=https://api.ultramsg.com/YOUR_INSTANCE_ID
 *   WHATSAPP_API_TOKEN=your_token
 *   WHATSAPP_SENDER_NUMBER=+218921234567
 *   DATABASE_URL=mysql://...  (for template + log tests)
 *   REDIS_URL=redis://...      (required for Test 6: BullMQ queue flow)
 *
 * HOW TO RUN (from project root):
 *   bun scripts/test-whatsapp.ts [phone_number]
 *
 * Example:
 *   bun scripts/test-whatsapp.ts +218921234567
 *
 * If no phone number is provided, it will use WHATSAPP_SENDER_NUMBER as target.
 */

import 'dotenv/config';
import { Queue, Worker } from 'bullmq';
import { WhatsAppTransport } from '../src/lib/whatsapp/transports/wapi';
import { whatsAppService } from '../src/lib/whatsapp/service';
import { db } from '../src/lib/db';

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const log = {
  success: (msg: string) =>
    console.log(`${COLORS.green}✅ ${msg}${COLORS.reset}`),
  error: (msg: string) => console.log(`${COLORS.red}❌ ${msg}${COLORS.reset}`),
  warn: (msg: string) =>
    console.log(`${COLORS.yellow}⚠️  ${msg}${COLORS.reset}`),
  info: (msg: string) => console.log(`${COLORS.blue}ℹ️  ${msg}${COLORS.reset}`),
  section: (msg: string) =>
    console.log(`\n${COLORS.bold}${COLORS.blue}=== ${msg} ===${COLORS.reset}`),
};

async function main() {
  const targetNumber = process.argv[2] || process.env.WHATSAPP_SENDER_NUMBER;

  if (!targetNumber) {
    log.error('No target phone number provided.');
    console.log('Usage: bun scripts/test-whatsapp.ts +218921234567');
    process.exit(1);
  }

  console.log(`${COLORS.bold}WhatsApp Integration Test Suite${COLORS.reset}`);
  console.log(`Target number: ${targetNumber}`);
  console.log('---');

  // ─────────────────────────────────────────────────────────────────
  // TEST 1: Environment Variables
  // ─────────────────────────────────────────────────────────────────
  log.section('Test 1: Environment Variables');

  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const senderNumber = process.env.WHATSAPP_SENDER_NUMBER;
  const isMockMode = !apiUrl || !apiToken;

  if (isMockMode) {
    log.warn(
      'WHATSAPP_API_URL or WHATSAPP_API_TOKEN not set → Running in MOCK MODE',
    );
    log.warn('Set these env vars to test real message delivery.');
  } else {
    log.success(`WHATSAPP_API_URL = ${apiUrl}`);
    log.success(`WHATSAPP_API_TOKEN = ${apiToken ? 'set' : 'not set'}`);
    log.success(`WHATSAPP_SENDER_NUMBER = ${senderNumber || '(not set)'}`);
  }

  // ─────────────────────────────────────────────────────────────────
  // TEST 2: Direct Transport Send
  // ─────────────────────────────────────────────────────────────────
  log.section('Test 2: Direct Transport Send');

  const transport = new WhatsAppTransport();
  const directResult = await transport.send(
    targetNumber,
    `🧪 مرحباً! هذه رسالة اختبار من نظام EBIC.\nWelcome! This is a test message from the EBIC system.\nTimestamp: ${new Date().toISOString()}`,
  );

  if (directResult.error) {
    log.error(`Transport send failed: ${directResult.error}`);
  } else {
    log.success(
      `Transport send succeeded! Message ID: ${directResult.messageId}`,
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // TEST 3: Phone Number Validation
  // ─────────────────────────────────────────────────────────────────
  log.section('Test 3: Phone Number Validation');

  const testNumbers = [
    { number: targetNumber, expected: true },
    { number: '0921234567', expected: true }, // Libya number without country code
    { number: '+218921234567', expected: true }, // Libya E.164
    { number: '1234', expected: false }, // Too short
    { number: 'abc', expected: false }, // Invalid
  ];

  for (const { number, expected } of testNumbers) {
    const valid = whatsAppService.validateNumber(number);
    const normalized = whatsAppService.normalizePhone(number);
    const pass = valid === expected;
    if (pass) {
      log.success(
        `${number} → valid=${valid}, normalized=${normalized || 'null'}`,
      );
    } else {
      log.error(`${number} → expected valid=${expected}, got valid=${valid}`);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // TEST 4: Database Templates
  // ─────────────────────────────────────────────────────────────────
  log.section('Test 4: WhatsApp Templates in Database');

  let templateTest = false;
  try {
    const templates = await db.messageTemplate.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        nameAr: true,
        nameEn: true,
        channel: true,
        bodyAr: true,
        bodyEn: true,
      },
    });

    if (templates.length === 0) {
      log.warn('No active templates found in the database.');
      log.info('Run: bun prisma/seed-templates.ts to seed templates.');
    } else {
      log.success(`Found ${templates.length} active template(s):`);
      for (const t of templates) {
        console.log(
          `  - [${t.channel}] ${t.slug} → "${t.nameAr}" / "${t.nameEn}"`,
        );
      }

      // Try sending the first WhatsApp-compatible template
      const waTemplate = templates.find(
        (t) => t.channel === 'WHATSAPP' || t.channel === 'BOTH',
      );

      if (waTemplate) {
        log.section('Test 4b: Template Send via WhatsApp Service');
        log.info(`Sending template: ${waTemplate.slug}`);

        const templateResult = await whatsAppService.sendTemplate(
          waTemplate.slug,
          targetNumber,
          {
            name: 'Test User',
            date: new Date().toLocaleDateString('ar-LY'),
            center: 'EBIC',
          },
        );

        if (templateResult.success) {
          log.success(`Template sent! ID: ${templateResult.messageId}`);
        } else {
          log.error(`Template send failed: ${templateResult.error}`);
        }
        templateTest = true;
      } else {
        log.warn('No WhatsApp or BOTH channel templates found.');
        log.info('Check that template channel is set to "WHATSAPP" or "BOTH".');
      }
    }
  } catch (dbError: any) {
    log.error(`Database error: ${dbError.message}`);
    log.info('Make sure DATABASE_URL is set and database is running.');
  }

  // ─────────────────────────────────────────────────────────────────
  // TEST 5: WhatsApp Logs Verification
  // ─────────────────────────────────────────────────────────────────
  log.section('Test 5: Checking WhatsApp Logs in Database');

  try {
    const recentLogs = await db.whatsAppLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        to: true,
        status: true,
        template: true,
        messageId: true,
        errorMessage: true,
        createdAt: true,
      },
    });

    if (recentLogs.length === 0) {
      log.warn(
        'No WhatsApp logs found. First message may not have been logged yet.',
      );
    } else {
      log.success(`Last ${recentLogs.length} WhatsApp log(s):`);
      for (const l of recentLogs) {
        const status = l.status === 'SENT' ? COLORS.green : COLORS.red;
        console.log(
          `  ${status}[${l.status}]${COLORS.reset} to=${l.to.slice(0, 8)}... ` +
            `template=${l.template} id=${l.messageId || 'none'} ` +
            `${l.errorMessage ? `error=${l.errorMessage}` : ''}`,
        );
      }
    }
  } catch (dbError: any) {
    log.error(`Could not read logs: ${dbError.message}`);
  }

  // ─────────────────────────────────────────────────────────────────
  // TEST 6: BullMQ Queue Flow (end-to-end)
  // ─────────────────────────────────────────────────────────────────
  log.section('Test 6: BullMQ Queue Flow');

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    log.warn('REDIS_URL not set — skipping queue test.');
    log.info('Set REDIS_URL=redis://localhost:6379 to enable this test.');
  } else {
    // Pre-flight: verify Redis is reachable with a silent one-shot ping.
    // Using retryStrategy: null so ioredis gives up immediately instead of
    // retrying (which is what causes the flood of ECONNREFUSED stack traces
    // when BullMQ's internal connections can't reach the server).
    const redisReachable = await new Promise<boolean>((resolve) => {
      // Dynamic import so we only pull ioredis when actually needed
      import('ioredis')
        .then(({ default: Redis }) => {
          const probe = new Redis(redisUrl, {
            maxRetriesPerRequest: 0,
            enableOfflineQueue: false,
            retryStrategy: () => null, // never retry
            lazyConnect: false,
          });
          probe
            .ping()
            .then(() => {
              probe.quit().catch(() => undefined);
              resolve(true);
            })
            .catch(() => {
              probe.disconnect();
              resolve(false);
            });
          // Safety timeout — ioredis may not fire an error immediately
          setTimeout(() => {
            probe.disconnect();
            resolve(false);
          }, 3_000);
        })
        .catch(() => resolve(false));
    });

    if (!redisReachable) {
      log.warn(`Redis not reachable at ${redisUrl} — skipping queue test.`);
      log.info('Start Redis locally or point REDIS_URL to a running instance.');
    } else {
      // Redis confirmed reachable — now safely create Queue + Worker
      const connection = {
        url: redisUrl,
        maxRetriesPerRequest: null, // required by BullMQ
        enableOfflineQueue: false,
      };
      const queueName = 'whatsapp-test';
      const queue = new Queue(queueName, { connection });

      const completed = await new Promise<boolean>((resolve) => {
        const TIMEOUT_MS = 15_000;
        let resolved = false;

        const worker = new Worker(
          queueName,
          async (job) => {
            const transport = new WhatsAppTransport();
            const result = await transport.send(job.data.to, job.data.body);
            if (result.error) throw new Error(result.error);
            return result;
          },
          { connection },
        );

        const finish = async (success: boolean) => {
          if (resolved) return;
          resolved = true;
          await worker.close();
          await queue.close();
          resolve(success);
        };

        worker.on('completed', (job, result) => {
          log.success(
            `Queue job completed! ID: ${job.id} | MsgID: ${result?.messageId}`,
          );
          finish(true);
        });
        worker.on('failed', (_job, err) => {
          log.error(`Queue job failed: ${err.message}`);
          finish(false);
        });

        queue
          .add('send-whatsapp', {
            to: targetNumber,
            body: `🔁 Queue flow test from EBIC system. ${new Date().toISOString()}`,
          })
          .then(() => log.info(`Job enqueued to queue "${queueName}"`));

        setTimeout(() => {
          log.error(`Queue test timed out after ${TIMEOUT_MS / 1000}s`);
          finish(false);
        }, TIMEOUT_MS);
      });

      if (!completed) log.warn('Queue test did not complete cleanly.');
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────────────────────
  log.section('Test Summary');
  if (isMockMode) {
    log.warn('Running in MOCK MODE — no real messages were sent.');
    log.info('To enable real sending, set these env vars in .env:');
    log.info('  WHATSAPP_API_URL=https://api.ultramsg.com/YOUR_INSTANCE_ID');
    log.info('  WHATSAPP_API_TOKEN=your_token');
    log.info('  WHATSAPP_SENDER_NUMBER=+218921234567');
  } else {
    log.success('Tests completed with real API credentials.');
  }
  if (!redisUrl) {
    log.warn('Queue test skipped — set REDIS_URL to enable.');
  }

  await db.$disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Fatal error:', err);
  await db.$disconnect().catch(() => undefined);
  process.exit(1);
});
