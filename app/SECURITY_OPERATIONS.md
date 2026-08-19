# Security operations

## Admission protection

- Turnstile is validated server-side for every admission mutation.
- Validation requires `success`, action `admission_inquiry`, and an exact request-hostname match.
- The secret is a Worker secret named `TURNSTILE_SECRET`; it must never be placed in source, Wrangler vars, screenshots, tickets, or logs.
- The `ADMISSION_RATE_LIMITER` binding allows five admission attempts per hashed client IP per minute. Cloudflare's binding is intentionally eventually consistent, so retain a dashboard WAF/rate-limiting rule as a second layer.
- A hidden honeypot rejects basic form-filling bots.
- A UUID idempotency key prevents browser retries from creating or emailing the same inquiry twice.
- API request bodies are capped at 16 KiB.

Monitor structured events named `turnstile_verification_failed`, `admission_email_failed`, and `admission_create_failed`. Alerts and access controls are configured in Cloudflare, not in this repository.

## Secret and access lifecycle

1. Restrict production deployment and D1 access to named staff using least privilege and MFA.
2. Rotate `TURNSTILE_SECRET` immediately if it may have been disclosed.
3. Review Worker, D1, email-routing, and DNS permissions quarterly.
4. Keep the academy notification mailbox access-limited and prevent automatic forwarding to personal/vendor mailboxes.
5. Do not log form payloads, tokens, email bodies, SQL parameters, phone numbers, addresses, or raw provider errors.

## Retention decision required before automatic deletion

The application stores the notice version and server-side consent timestamp for every new inquiry. The organization must approve a retention duration and rules for active/admitted inquiries before a deletion job is enabled. Automatic deletion is intentionally not included because an unapproved cleanup schedule could destroy required records.

After the policy is approved, implement and stage-test a scheduled D1 deletion that:

- selects only records beyond the approved duration and in approved terminal states;
- logs counts and correlation IDs, never row contents;
- supports a dry-run/report-only period;
- accounts for mailbox copies and backups; and
- has a documented recovery and exception process.

This is a technical operations checklist, not legal advice.
