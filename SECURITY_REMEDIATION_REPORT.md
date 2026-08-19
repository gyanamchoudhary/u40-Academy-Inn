# Security remediation report

Date: 19 August 2026

Scope: repository and local Cloudflare Worker runtime

Source audit: `SECURITY_AUDIT_REPORT.md`

## Outcome

All code and repository findings have been remediated. The application now passes unit tests, TypeScript checks, linting, dependency audit, production build, Cloudflare deployment dry-run, local D1 migrations, and local Worker smoke tests. Production remains unchanged until the release steps below are performed.

## Finding disposition

| Finding | Disposition |
|---|---|
| U40-H01 plaintext HTTP / no HSTS | Fixed in Worker canonical redirect and response-header middleware; activate by deployment and also enable dashboard Always Use HTTPS. |
| U40-H02 admission abuse | Fixed with server-validated Turnstile, hostname/action checks, rate-limit binding, honeypot, UUID idempotency, and post-validation email. |
| U40-M01 browser headers | Fixed with CSP, frame denial, MIME protection, referrer and permissions policies, HSTS on HTTPS, and API no-store/noindex. |
| U40-M02 external/full-PII email | Fixed: destination is the verified admissions mailbox `u40academyadmission@gmail.com`; notifications contain only essential callback fields and the database holds full details. |
| U40-M03 vulnerable Hono | Fixed by upgrade to Hono 4.13.3. |
| U40-M04 unsafe Docker image | Fixed by removing the unused Docker/Node deployment path. |
| U40-M05 parallel workers.dev route | Fixed with `workers_dev: false`. |
| U40-M06 50 MiB API body | Fixed with a 16 KiB API limit and verified 413 behavior. |
| U40-M07 vulnerable toolchain | Fixed through upgrades/removal; full and production npm audits report zero vulnerabilities. |
| U40-L01 validation gaps | Fixed with real non-future date validation, 0–100 percentage validation, explicit bounds, and control-character rejection. |
| U40-L02 consent/retention | Consent timestamp and notice version are stored; privacy and operations documentation were updated. Automated deletion awaits an organization-approved retention duration and terminal-state policy to avoid destructive data loss. |
| U40-L03 raw error logging | Fixed with structured event/type-only logs and stack-free API error responses. |
| U40-L04 legacy dependencies | Fixed by removing unused Node, MySQL, dotenv, inspector, and build dependencies/files. |

## Verification completed

- All unit tests pass, including validation, email escaping/minimization, Turnstile fail-closed behavior, and security headers.
- A local Worker smoke test returned 200 for the site and health query, 404 for an unknown API route, and 413 for a 17 KiB API body.
- Local D1 migrations applied successfully.
- A dummy-key local admission produced one database record and one minimized local email notification; retrying the same idempotency key returned the original reference and did not email again.
- A foreign-origin mutation returned 403 without a stack trace.
- The Cloudflare dry-run recognizes D1, static assets, academy email, and the five-per-minute rate-limit binding.
- No production inquiry was submitted and no remote data or configuration was changed during remediation.

## Required release activation

1. Create a production Turnstile widget restricted to `u40academy.com` and `www.u40academy.com` and build with its public `VITE_TURNSTILE_SITE_KEY`.
2. Store the matching secret with `wrangler secret put TURNSTILE_SECRET`; never put it in source or Wrangler vars.
3. Confirm the academy email destination, apply the committed D1 migrations remotely, deploy, and recheck both HTTP and HTTPS hostnames.
4. Enable/review dashboard Always Use HTTPS, WAF/rate-limiting defense in depth, access controls, alerts, and D1 recovery settings.
5. Approve a retention policy before enabling automated deletion; follow `app/SECURITY_OPERATIONS.md`.
