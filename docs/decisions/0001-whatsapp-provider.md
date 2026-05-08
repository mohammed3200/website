# ADR 0001 — WhatsApp Transactional Provider

## Status

**Accepted** — 2026-05-08. Recorded retroactively against the existing wiring
in `src/lib/whatsapp/transports/wapi.ts` (UltraMsg). This ADR formalises a
choice that was implicit in code but never written down; future re-evaluation
should reference §"Migration path".

## Context

The platform sends transactional WhatsApp messages from Misurata, Libya
(Tripoli timezone, +218 country code). Use cases today and on the roadmap:

- Registration acknowledgement to applicants (innovators, collaborators)
- Status-change notifications (approved / rejected)
- Optional 2FA fallback when email is unreliable
- Generic admin-driven announcements via `MessageTemplate`

We need a provider that:

1. Accepts outbound traffic from a Libyan-registered number with reasonable
   setup time (Libya's regulatory environment makes Meta business
   verification non-trivial).
2. Supports Arabic content (UTF-8 template body).
3. Has a sandbox mode so we can run smoke tests without sending real messages.
4. Has a stable HTTP API our existing BullMQ worker can hit.
5. Fits a small-budget public-sector deployment.

The codebase currently calls UltraMsg via `WhatsAppTransport.send()`
(`src/lib/whatsapp/transports/wapi.ts`). This ADR records why.

## Options Considered

| Axis | Meta Cloud API | Twilio | UltraMsg (chosen) |
|---|---|---|---|
| Setup steps | (1) Create Meta App → (2) Phone number registration → (3) Business verification → (4) Display-name approval → (5) Template approval | (1) Create Twilio account → (2) Buy / port WhatsApp Business sender → (3) Sender registration with Meta (still required) → (4) Template approval | (1) Sign up at ultramsg.com → (2) Create instance → (3) Scan QR with WhatsApp on the registered Libya phone → (4) Copy `instance_id` + token |
| Business verification required | **Yes** — Meta-mandated KYC of legal entity. Public sources note ~2–6 week typical processing for incomplete-jurisdiction documents. [1] | **Yes** — same Meta Business verification gate (Twilio is a BSP, not the issuer). [2] | **No** — UltraMsg is a self-serve gateway sitting on top of WhatsApp Web; no Meta business verification needed. [3] |
| Cost (per conversation, USD) | Marketing $0.0331 / Service-initiated $0.0264 (LY rate, 2026 published list). [1] | Same Meta per-conversation fee + Twilio fee $0.005 + monthly sender $80. [2] | Flat instance subscription, $9 / mo for 5 000 msg, $19 / mo for 20 000 msg, $39 / mo for unlimited. [3] |
| Cost (free tier, monthly) | 1 000 free Meta-initiated service conversations per month. [1] | None at the WhatsApp tier (trial credit only). [2] | 3-day free trial, no permanent free tier. [3] |
| Libya phone-number support | Meta supports +218 only after Business Verification; the Display Name step has historically rejected Libyan org names. [1] | Same Meta gate; Twilio cannot port +218 numbers. [2] | Libya numbers fully supported (the QR-scan flow is the same as personal WhatsApp). [3] |
| Arabic content support | Yes, full UTF-8 in body and headers. [1] | Yes. [2] | Yes — body is sent as-is. [3] |
| Template approval lead time | Meta-mediated: typically minutes to 24 h once Business is verified, but template-rejection loops are common. [1] | Meta-mediated; same as above. [2] | None — UltraMsg sends via WhatsApp Web, so templates are not enforced for non-marketing traffic. [3] |
| SDK / REST surface | REST: `https://graph.facebook.com/v22.0/{phone_number_id}/messages`. [1] | REST: `https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json` or Twilio SDK. [2] | REST: `https://api.ultramsg.com/{instance_id}/messages/chat`, form-encoded. [3] |
| Webhook signing | HMAC-SHA256 with App Secret in `X-Hub-Signature-256`. [1] | HMAC-SHA1 in `X-Twilio-Signature`. [2] | None — UltraMsg uses a per-instance shared token in the webhook URL path; no signed body. [3] |
| Median latency (regional) | ~250–500 ms from EU PoPs to Libya. [1] | ~300–600 ms (depends on Twilio region). [2] | ~400–800 ms; UltraMsg PoPs are EU/US. [3] |
| Sandbox / test number | Yes — free dev number with 5 test recipients, valid 90 days. [1] | Yes — `whatsapp:+14155238886` shared sandbox. [2] | Yes — instance can be left empty (mock mode in `wapi.ts:39`) or configured with the dev account. [3] |
| Vendor lock-in score (1–5) | 3 — Meta-native; payloads and template IDs port to other Meta-Cloud BSPs. | 4 — wire format is Twilio-specific. | 2 — single-endpoint REST; we already isolate it behind `WhatsAppTransport`. |

[1] Meta WhatsApp Business Platform — Pricing & Conversation Categories: https://developers.facebook.com/docs/whatsapp/pricing — accessed 2026-04. (Libya pricing read from the published rate-card.)
[2] Twilio WhatsApp pricing & sender registration: https://www.twilio.com/en-us/whatsapp/pricing — accessed 2026-04.
[3] UltraMsg public docs & pricing: https://docs.ultramsg.com/api/send-messages/chat-messages and https://ultramsg.com/pricing — accessed 2026-04.

## Decision

**Decision: UltraMsg is our transactional WhatsApp provider for the EITDC
platform's first production phase.**

Rationale (one paragraph):

UltraMsg is the only option of the three that does not require Meta Business
Verification, which has historically been a 2–6 week blocker for
public-sector entities in Libya. The pricing ($9–$39 / month flat) fits the
college's budget and is predictable, while Meta and Twilio bill per
conversation with a 30-day rolling window we cannot easily forecast. The
absence of webhook signing is the main technical gap we accept; we mitigate
it by binding the inbound webhook to a unique URL path (rotated when
credentials rotate) and by treating inbound payloads as untrusted user
input. Because the entire integration is mediated by `WhatsAppTransport`,
we keep the option to migrate to Meta Cloud or Twilio open should
verification become tractable.

## Consequences

### Env vars

Added (kept unchanged, ratified by this ADR):
- `WHATSAPP_API_URL`
- `WHATSAPP_API_TOKEN`
- `WHATSAPP_SENDER_NUMBER`

Not used / removed:
- `WHATSAPP_PROVIDER`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
  `WHATSAPP_BUSINESS_ACCOUNT_ID` were Meta-Cloud-flavoured names from an
  earlier draft contract; they are not consumed by any code path and are
  documented as **reserved for future migration** in `.env.example`.

### Operational

- The QR-scan device (one phone) is part of the platform's recovery plan.
  If the linked phone goes offline for >7 days, UltraMsg requires re-scan.
  Owner: platform admin.
- Webhook URL must be rotated on token rotation. Inbound webhook HMAC is
  not used; we treat all inbound bodies as untrusted.

### Migration path

If we later need Meta-Cloud for compliance or volume reasons:

1. Add `WHATSAPP_PROVIDER` env var to choose between `ultramsg | meta_cloud`.
2. Implement `MetaCloudTransport` alongside `WhatsAppTransport` behind the
   same `send(to, body)` interface.
3. Add a feature flag in `WhatsAppService.transport` selection.
4. Run both transports in shadow mode against the smoke harness for one
   week before cutting traffic over.

No data model migration needed — `MessageTemplate` and `WhatsAppLog` are
provider-agnostic.

### Risks accepted

| Risk | Mitigation |
|---|---|
| UltraMsg drops the linked WhatsApp account (TOS violation) | Smoke alert in `whatsapp-smoke.ts` runs nightly; dashboard shows queue health (Task 13) |
| No webhook signing | Bind webhook to a rotated, unguessable URL path |
| Vendor disappearance | `WhatsAppTransport` is the only file that must change to swap providers |
