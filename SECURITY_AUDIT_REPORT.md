# SECURITY AUDIT REPORT

> This report is the pre-remediation audit snapshot. Implementation and
> verification status is tracked in `SECURITY_REMEDIATION_REPORT.md`.

## 1. Executive Summary

| Item | Result |
|---|---|
| Application | U40 Academy Inn public website and admission inquiry form |
| Production URL | `u40academy.com` |
| Technology | React 19, TypeScript, Vite, Hono, tRPC, Zod, Drizzle ORM, Cloudflare Workers, D1, Cloudflare Email Routing/Send Email binding |
| Environment | Production Worker plus repository/configuration review |
| Audit date | 19 August 2026 (Asia/Kolkata) |
| Overall risk | **HIGH** |
| Security score | **55/100** |
| Production readiness | **NOT READY** |

The application has a small attack surface and several good controls: the admission schema is enforced on the server, database writes use Drizzle rather than string-built SQL, the tRPC input object strips unexpected properties, React safely escapes the confirmation view, the HTML email escapes all visitor-controlled fields, CORS is not permissive, and there is no public API for reading admission records.

Two confirmed issues block production readiness:

1. The complete site and relative API endpoint are available over unencrypted HTTP. HTTP does not redirect to HTTPS and HTTPS responses do not include HSTS. A visitor who reaches the HTTP site can submit names, phone numbers, dates of birth, and residential addresses without transport encryption.
2. The public admission mutation has no CAPTCHA/Turnstile, server-side throttling, duplicate protection, or honeypot, and the Worker accepts API bodies up to 50 MiB. This permits low-cost automated database and email abuse. No bulk requests were sent during this audit.

No critical vulnerability, exposed secret, SQL injection, confirmed XSS, authentication bypass, record exposure, file upload issue, SSRF, open redirect, or permissive CORS policy was found.

### Scope and test boundaries

- **CONFIRMED:** current source/configuration findings, local schema tests, dependency audit results, and passive production header/TLS/CORS observations.
- **POTENTIAL:** findings whose impact depends on an alternate deployment, a future admin renderer, Cloudflare dashboard settings, or provider behavior that cannot be proven from this repository.
- **NOT TESTED:** Cloudflare dashboard-only WAF/bot/backups/access settings, authenticated administration (none exists in the repository), D1 production contents, mailbox contents, and active OWASP ZAP scanning.
- **NOT APPLICABLE:** file uploads, application authentication/sessions, payments, and AI/LLM functionality.
- No admission mutation was called, no real or synthetic record was written to production, and no customer/student record was read.

## 2. Architecture

### Short architecture summary

```text
Browser (React/Vite, relative /api/trpc client)
    -> Cloudflare edge / custom domains
        -> Hono Worker
            -> tRPC public admission.submit mutation
                -> Zod server-side validation
                -> Drizzle parameterized INSERT
                    -> Cloudflare D1 admission_inquiries
                -> Cloudflare Send Email binding
                    -> configured admissions notification mailbox
```

### Component inventory

| Area | Identified implementation |
|---|---|
| Frontend | React 19.2.3, React Router 7.18.2, Vite 7.3.0, Tailwind CSS |
| Backend | Hono 4.12.32 running as a Cloudflare Worker; tRPC 11 API |
| Language | TypeScript/JavaScript |
| Database | Cloudflare D1 (SQLite semantics), Drizzle ORM |
| Authentication | None implemented; public informational site and public admission mutation |
| API architecture | tRPC over `/api/trpc`; generic Hono handler |
| Hosting | Cloudflare Worker with static assets binding and custom domains |
| Cloudflare | D1 binding, static assets binding, outbound email binding; `workers_dev` enabled |
| Environment variables | Legacy Node helpers reference `APP_ID`, `APP_SECRET`, and `DATABASE_URL`, but the Worker path uses bindings; no current `.env` file exists |
| Admission form | `app/src/components/site/ApplicationForm.tsx` |
| Submission endpoint | `POST /api/trpc/admission.submit` (tRPC mutation) |
| Email | Cloudflare `SendEmail` binding; rich and plain-text notification |
| Admin dashboard | Not present |
| File upload | Not present |
| Third parties | Cloudflare platform and an outbound Google Maps link; no runtime analytics SDK found |
| Analytics/tracking | None found in source or deployed resource references |
| AI/LLM | None found |
| Payments | None found |

Primary evidence: `app/wrangler.jsonc:3-39`, `app/api/app.ts:8-33`, `app/api/router.ts:4-7`, `app/api/admissionRouter.ts:7-38`, `app/api/queries/admissions.ts:15-40`, and `app/api/services/admissionEmail.ts:76-90`.

## 3. Security Score

**55/100.** This is a risk-prioritization score, not a certification.

| Deduction | Reason |
|---:|---|
| -12 | Sensitive admission flow remains usable over HTTP; no redirect or HSTS |
| -10 | No application-level anti-automation or duplicate controls |
| -5 | Missing CSP, clickjacking, MIME, referrer, and permissions headers |
| -4 | All inquiry PII is duplicated into an external-domain email mailbox |
| -3 | Vulnerable production Hono version |
| -3 | Dockerfile would copy `.env` into a runtime image |
| -2 | `workers_dev` leaves a potential parallel public hostname/control-bypass path |
| -3 | Oversized body limit and incomplete semantic/control-character validation |
| -3 | Development dependency and unused dependency hygiene |
| **55 remaining** | Strong server validation, parameterized D1 writes, safe output encoding, no read API, restrictive CORS, valid TLS, no exposed secret/source map |

## 4. Critical Findings

No critical findings.

## 5. High Findings

### U40-H01 — Admission flow is served over plaintext HTTP

| Field | Detail |
|---|---|
| Status | **CONFIRMED** |
| Severity | **HIGH** |
| Affected component | `http://u40academy.com/`, relative `/api/trpc` client |
| What is wrong | A passive request on 19 August 2026 returned `HTTP/1.1 200 OK` from the HTTP origin instead of redirecting to HTTPS. HTTPS responses had no `Strict-Transport-Security`. The form client posts to a relative URL at `app/src/providers/trpc.tsx:8-19`, so an HTTP-loaded page will use the HTTP API origin. |
| Why it matters | Names, guardian details, phone, optional email/date of birth, academic data, and residential address can traverse the network without encryption. An on-path attacker could observe or alter the form and submission. |
| Safe reproduction | `curl -sS -o /dev/null -D - http://u40academy.com/` returns 200 rather than a 301/308 to HTTPS. `curl -sS -o /dev/null -D - https://u40academy.com/` has no HSTS header. No form submission is required. |
| Recommended fix | Enable Cloudflare **Always Use HTTPS**, verify every hostname redirects once to the canonical HTTPS host, then enable HSTS after confirming HTTPS continuity. Consider including subdomains only after checking all subdomains. Add an application/transform-rule HSTS header and regression-test HTTP and HTTPS. Cloudflare guidance: <https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/> and <https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/>. |

### U40-H02 — Public admission mutation has no anti-automation controls

| Field | Detail |
|---|---|
| Status | **CONFIRMED** (implementation); bulk exploitation **NOT TESTED** |
| Severity | **HIGH** |
| Affected component | `admission.submit`; D1 writes; admissions email notifications |
| What is wrong | `app/api/middleware.ts:9-10` exposes only a public procedure type, and `app/api/admissionRouter.ts:7-19` performs a database insert and email on every schema-valid mutation. There is no Turnstile/CAPTCHA token, IP or fingerprint throttle, honeypot, idempotency key, or duplicate check anywhere in the request path. |
| Why it matters | A script can create large volumes of plausible inquiries, fill the database, consume Worker/D1/email quotas, and bury legitimate inquiries. Client-side pending-state disabling is not a server security control. |
| Safe reproduction | Static inspection confirms an unconditional public mutation. No repeated production requests were sent. Locally, duplicate objects pass the schema because uniqueness/deduplication is not part of validation. |
| Recommended fix | Layer controls: (1) Cloudflare Turnstile on the form with mandatory server-side Siteverify validation, expected hostname/action checks, and the secret stored as a Worker secret; (2) a Cloudflare rate-limiting rule or Worker rate-limit binding scoped specifically to the mutation; (3) a short-window duplicate/idempotency digest; (4) a honeypot and monitoring/alerts; (5) do not send email until bot validation succeeds. Cloudflare states that client-only Turnstile is insufficient: <https://developers.cloudflare.com/turnstile/get-started/server-side-validation/>. |

## 6. Medium Findings

### U40-M01 — Baseline browser security headers are absent

| Field | Detail |
|---|---|
| Status | **CONFIRMED** |
| Severity | **MEDIUM** |
| Affected component | HTML and API responses; `app/api/app.ts:14-33` |
| Description | Passive production responses lacked `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and both `frame-ancestors` and `X-Frame-Options`. No header middleware or static response-header configuration exists in the repository. |
| Impact | Missing defense in depth increases the impact of a future injection, permits framing/clickjacking, and allows broader browser capabilities/referrer disclosure than necessary. |
| Safe reproduction | Inspect `curl -D - https://u40academy.com/` and the ping endpoint headers. |
| Recommended fix | Add a nonce/hash-based CSP suitable for Vite assets, at minimum `object-src 'none'`, `base-uri 'self'`, and `frame-ancestors 'none'`; also add `X-Content-Type-Options: nosniff`, a restrictive `Referrer-Policy`, and a least-privilege `Permissions-Policy`. Test in CSP report-only mode first. |

### U40-M02 — Complete inquiry PII is duplicated into an external-domain mailbox

| Field | Detail |
|---|---|
| Status | **CONFIRMED** |
| Severity | **MEDIUM** |
| Affected component | `app/api/services/admissionEmail.ts:3-5`, `:25-40`, `:83-90`; `app/wrangler.jsonc:33-38` |
| Description | Every collected field—including student/guardian names, phone, optional email and date of birth, school, percentage, residential address, and free text—is stored in D1 and copied into an email addressed to a `vardex.in` mailbox. The public privacy page states that inquiry data is accessed only by the U40 admissions team (`app/src/pages/Privacy.tsx:22-29`). |
| Impact | The same personal information, likely including minors' data, exists in two security domains with separate retention, forwarding, access, and breach surfaces. The configured destination also creates a technical mismatch with the public access statement unless that mailbox is demonstrably controlled exclusively for U40 admissions. |
| Safe reproduction | Source inspection only; no mailbox or real record was accessed. |
| Recommended fix | Route notifications to an academy-controlled mailbox, minimize the email to a reference code and necessary callback fields, and keep full details in an access-controlled system. Define mailbox retention/access controls and align the technical flow with the public notice. Review legal obligations separately. |

### U40-M03 — Production Hono version has known advisories

| Field | Detail |
|---|---|
| Status | **CONFIRMED dependency state**; applicability varies |
| Severity | **MEDIUM** |
| Affected component | Hono 4.12.32 at `app/package-lock.json:7311-7312` |
| Description | `npm audit --omit=dev` reported one vulnerable production package with four advisories: CORS-header ReDoS (GHSA-8j4g-w8fx-2239), `memo()` cross-request disclosure (GHSA-f23p-vx2j-j53r), proxy connection-header handling (GHSA-79qm-7rj5-m7r9), and language-middleware complexity DoS (GHSA-54fx-42gc-7vw4). This app does not currently call the affected CORS, `memo`, proxy, or language helpers, reducing direct exploitability. |
| Impact | Future code changes or framework internals may expose the vulnerable paths, and retaining a vulnerable runtime framework weakens patch posture. |
| Safe reproduction | `cd app && npm audit --omit=dev`. Result: 1 moderate production vulnerability, 0 high/critical. |
| Recommended fix | Upgrade Hono to at least 4.12.34; the audit-time compatible target was 4.13.3. Run tests, typecheck, Worker dry-run, and passive endpoint regression checks afterward. |

### U40-M04 — Docker build is designed to embed `.env` in the runtime image

| Field | Detail |
|---|---|
| Status | **POTENTIAL** (alternate deployment; current Worker does not use it) |
| Severity | **MEDIUM** |
| Affected component | `app/Dockerfile:14-18`; `app/.dockerignore:1-5` |
| Description | The final image copies `/app/.env` from the build stage, while `.dockerignore` does not exclude `.env`. No `.env` currently exists, so no current secret was found; the current image build would also fail at that copy unless a file is supplied. |
| Impact | If a developer adds a real `.env` so the Docker build succeeds, credentials become an image layer/file accessible to anyone who can pull or inspect the image. |
| Safe reproduction | Read the Dockerfile and `.dockerignore`; do not build with real secrets. |
| Recommended fix | Never copy `.env` into either build context or image. Add `.env*` exclusions with an explicit exception for a sanitized example. Inject runtime secrets through the deployment platform, and use BuildKit secret mounts only for build-time needs. Remove or repair the unused Node/Docker path if Cloudflare Workers is the sole deployment. |

### U40-M05 — `workers.dev` remains enabled as a potential parallel public route

| Field | Detail |
|---|---|
| Status | **POTENTIAL** |
| Severity | **MEDIUM** |
| Affected component | `app/wrangler.jsonc:3-17` |
| Description | `workers_dev: true` allows a `workers.dev` hostname in addition to the custom domains. The account subdomain was not obtained or probed, so reachability was not confirmed. |
| Impact | Zone-scoped redirect, WAF, bot, header, or rate-limit rules on `u40academy.com` may not cover the parallel hostname, creating a control-bypass route to the same Worker. This is not an origin-server bypass—the application itself is the Worker—but it can bypass custom-domain policy. |
| Safe reproduction | Review the Cloudflare deployment/routes dashboard; no hostname guessing or probing was performed. |
| Recommended fix | Set `workers_dev: false` for production unless the route is explicitly required. If required, apply equivalent controls and monitor it. |

### U40-M06 — API body limit is disproportionate to the schema

| Field | Detail |
|---|---|
| Status | **CONFIRMED** |
| Severity | **MEDIUM** |
| Affected component | `app/api/app.ts:17` |
| Description | Every `/api/*` request may carry up to 50 MiB. The declared maxima for the bounded admission fields total under 3 KiB, and the only currently uncapped string is email, so the intended payload is still tiny relative to this limit. |
| Impact | An unauthenticated client can force unnecessary edge parsing/buffering and bandwidth consumption. This amplifies the absence of rate limiting even though Zod ultimately rejects oversized fields. |
| Safe reproduction | Static inspection only; no large request was sent. |
| Recommended fix | Reduce the global limit to a small, measured JSON ceiling (for example, enough for the serialized schema plus conservative overhead) and keep a stricter endpoint-specific limit. Reject unsupported content types early. |

### U40-M07 — Development/build dependency tree contains multiple known vulnerabilities

| Field | Detail |
|---|---|
| Status | **CONFIRMED dependency state** |
| Severity | **MEDIUM** |
| Affected component | Local/CI build and development toolchain |
| Description | Full `npm audit` reported 19 affected packages: 10 high, 8 moderate, 1 low, 0 critical. `npm audit --omit=dev` reduced this to Hono alone, so the other items do not ship as Worker runtime dependencies but can affect developer/CI systems processing untrusted files or exposing dev servers. |
| Impact | Build-time file read/write, development-server disclosure, prototype pollution, and resource-exhaustion issues could affect CI or developer machines. |
| Recommended fix | Upgrade direct development tools on a review branch, regenerate the lockfile, avoid exposing Vite/Wrangler dev servers to untrusted networks, and rerun the full audit. Do not blindly accept the audit-suggested Drizzle Kit downgrade; resolve that chain manually. |

## 7. Low Findings

### U40-L01 — Semantic date and control-character validation is incomplete

| Field | Detail |
|---|---|
| Status | **CONFIRMED** |
| Severity | **LOW** |
| Affected component | `app/contracts/admissions.ts:47-53`, `:55-97`; email subject at `app/api/services/admissionEmail.ts:63` |
| Description | Date of birth checks only `YYYY-MM-DD`; impossible and future dates pass. Names/messages accept control characters, and student name is interpolated into an email subject. Email has no explicit length cap beyond Zod's email-format implementation. Harmless local tests confirmed acceptance of `2026-99-99`, `2099-01-01`, HTML/SQL-like text, Unicode, and CR/LF in names. Acceptance of markup is not itself XSS because current output sinks encode it. |
| Impact | Primarily data quality and a potential email-header/log ambiguity issue. The structured Cloudflare email builder may reject unsafe headers, so header injection was not confirmed. |
| Recommended fix | Parse and validate a real past calendar date and reasonable age range; reject C0 controls in human-readable fields; explicitly cap email length; normalize Unicode where operationally appropriate without excluding legitimate Bengali/Indian names. Keep sink-specific encoding. |

### U40-L02 — Consent evidence, retention, and deletion controls are not represented

| Field | Detail |
|---|---|
| Status | **CONFIRMED** for consent omission; retention/deletion **NOT TESTED/POTENTIAL** |
| Severity | **LOW** |
| Affected component | `app/api/queries/admissions.ts:19-21`; D1 schema |
| Description | Consent is required at submission but intentionally discarded. The schema contains no consent timestamp/version, retention deadline, deletion marker, or minimization workflow. Cloudflare dashboard backup/retention settings were not available. |
| Impact | It is harder to demonstrate what notice was accepted, and inquiry data may remain longer than operationally needed. |
| Recommended fix | Store a server timestamp and notice/version identifier rather than a redundant boolean; define and automate retention/deletion based on inquiry status; document access and deletion procedures. Obtain separate legal review. |

### U40-L03 — Error logging may include sensitive database/provider context

| Field | Detail |
|---|---|
| Status | **POTENTIAL** |
| Severity | **LOW** |
| Affected component | `app/api/admissionRouter.ts:20-31` |
| Description | Raw caught error objects are written to Worker logs after email or D1 failures. The code does not directly log input, but provider/ORM errors can include request, SQL, binding, recipient, or message context depending on implementation. |
| Impact | Personal information or internal details could persist in logs with broader access/retention than the admissions database. |
| Recommended fix | Emit structured error codes and correlation IDs, explicitly redact PII and message bodies, and define log access/retention. Verify actual Cloudflare log serialization with synthetic local failures. |

### U40-L04 — Unused/legacy production dependencies enlarge maintenance surface

| Field | Detail |
|---|---|
| Status | **CONFIRMED** by import search |
| Severity | **LOW** |
| Affected component | `app/package.json:23-45`; `app/api/lib/*` |
| Description | `mysql2`, `dotenv`, and the Node static-server helper path are not used by the production Worker. `HttpClient` and legacy env helpers have no imports. `@hono/node-server` is only referenced by an unused helper. The niche `kimi-plugin-inspect-react` is wired into Vite, but no inspector metadata appeared in deployed output and there is no evidence it is malicious. No direct dependency was confirmed abandoned or npm-deprecated. |
| Impact | Extra packages increase dependency-audit noise, install-time supply-chain surface, and confusion over the supported deployment architecture. |
| Recommended fix | Remove dependencies and legacy files only after confirming no local workflow uses them. Pin and review niche build plugins; retain only necessary production dependencies. |

## 8. Informational Findings and Positive Controls

### U40-I01 — Server-side validation and mass-assignment resistance

**CONFIRMED.** The same `admissionInquirySchema` is attached to the server mutation at `app/api/admissionRouter.ts:8-10`. Required fields, maximum lengths, phone/email format, enum values, and boolean consent are server enforced. Default Zod object behavior strips unknown keys; a harmless local `role: "admin"` marker was accepted only after that key was removed from parsed output.

### U40-I02 — SQL injection resistance

**CONFIRMED by static analysis.** `app/api/queries/admissions.ts:24-30` uses Drizzle `.insert(...).values(...)`; no raw SQL or string-built query sink accepts user input. SQL-like text remains data. No destructive injection test was run.

### U40-I03 — Current XSS sinks encode admission data

**CONFIRMED.** React renders the returned name/course/reference as text (`app/src/components/site/ApplicationForm.tsx:168-180`). The email HTML applies `escapeHtml` before markup insertion (`app/api/services/admissionEmail.ts:7-18`, `:47-54`), with a passing unit test at `app/api/services/admissionEmail.test.ts:30-35`. No admin dashboard or CRM renderer exists. Stored data remains raw, so any future admin/CRM view must preserve contextual encoding.

### U40-I04 — CORS is restrictive by default

**CONFIRMED passively.** A cross-origin GET returned no `Access-Control-Allow-Origin`; a synthetic preflight received 415 and no allow headers. The source installs no CORS middleware. This blocks browser cross-origin API reads/submissions requiring preflight. Direct scripts are not constrained by CORS, so CORS does not replace anti-bot controls.

### U40-I05 — TLS, method handling, and source maps

**CONFIRMED passively.** HTTPS used a currently valid certificate covering apex and `www`; TRACE returned 405; the deployed JS had no source-map directive and the adjacent `.map` request returned 404. The only `http://` strings in deployed HTML were SVG XML namespace identifiers, not mixed-content fetches.

## 9. Admission Form Security

### Fields and validation

| Field | Required | Server constraint | Stored | Included in email |
|---|---:|---|---:|---:|
| Student name | Yes | Trim, 2–120 chars | Yes | Yes |
| Guardian name | Yes | Trim, 2–120 chars | Yes | Yes |
| Phone | Yes | Regex; international-style digits/spaces/hyphens | Yes | Yes |
| Email | No | Email format; no explicit max | Yes | Yes |
| Date of birth | No | Format only, not semantic date | Yes | Yes |
| Current class | Yes | Fixed enum | Yes | Yes |
| Course interest | Yes | Fixed enum | Yes | Yes |
| Board | Yes | Fixed enum | Yes | Yes |
| School | No | Max 160 | Yes | Yes |
| Previous percentage | No | Free text, max 20 | Yes | Yes |
| Residential address | Yes | 10–700 chars | Yes | Yes |
| Message | No | Max 900 | Yes | Yes |
| Consent | Yes/true | Boolean refined to true | No | No |

### Harmless local validation matrix

| Case | Result | Security interpretation |
|---|---|---|
| Empty/missing required values | Rejected | Good |
| Message >900 chars | Rejected | Good |
| Invalid email/phone | Rejected | Good |
| Unexpected numeric phone | Rejected | Good |
| Extra `role` property | Stripped | Good mass-assignment behavior |
| HTML/JavaScript marker text | Accepted as data | Safe in current encoded sinks; retain sink encoding |
| SQL-like marker text | Accepted as data | Safe with current parameterized insert |
| Unicode/Bengali name | Accepted | Good internationalization behavior |
| Impossible/future date | Accepted | Data-quality gap |
| CR/LF in name | Accepted | Control/header-hardening gap |
| Duplicate payload | No application prevention | Abuse gap |

### Overall form assessment

- Validation: strong syntactic server validation; semantic date/control/email length improvements needed.
- XSS: no confirmed reflected, stored, or DOM XSS in current data flow.
- Injection: no SQL/command/template/LDAP/NoSQL injection sink found.
- Spam/rate limiting: inadequate and a production blocker.
- API: only a public write and health query; no read/list/update/delete exposure.
- Database: parameterized D1 insert; all PII except consent is stored.
- Email: rich HTML escaped; complete PII duplication and subject control-character hardening need attention.
- Privacy: high-volume personal/minor data collection with no coded retention workflow.

## 10. Authentication & Authorization

**NOT APPLICABLE to the current feature set.** No login, user account, admin page, session, JWT, OAuth, role system, record-read endpoint, or object-by-ID endpoint exists. Therefore IDOR/admin privilege testing could not be performed and is not currently exposed by this repository.

If an admin dashboard is added, it must use backend-enforced authentication and role checks on every read/update endpoint. A reference code must not be treated as authorization.

## 11. Infrastructure Security

| Control | Status | Result |
|---|---|---|
| Cloudflare proxy | **CONFIRMED** | Public DNS resolves to Cloudflare and responses identify Cloudflare |
| TLS certificate | **CONFIRMED** | Valid at audit time; apex and `www` covered |
| HTTP to HTTPS redirect | **CONFIRMED FAIL** | HTTP returned 200 |
| HSTS | **CONFIRMED FAIL** | Header absent |
| CSP/frame protection/nosniff/referrer/permissions | **CONFIRMED FAIL** | Headers absent |
| CORS | **CONFIRMED PASS** | No permissive ACAO; preflight not allowed |
| TRACE | **CONFIRMED PASS** | 405 |
| WAF managed rules | **NOT TESTED** | Dashboard-only setting |
| Bot management/rate rules | **NOT TESTED** at zone; **CONFIRMED absent** in app/repo |
| D1 backups/PITR | **NOT TESTED** | Dashboard-only setting |
| Origin bypass | **NOT APPLICABLE** in the traditional sense; app is a Worker |
| Parallel route | **POTENTIAL** | `workers_dev: true` |
| Public storage | **NOT APPLICABLE** | No R2/public upload storage binding |

The TLS check used a passive handshake only. No downgrade, cipher-enumeration, WAF-evasion, or denial-of-service testing was performed.

## 12. Dependency Security

Package manager: npm with `app/package-lock.json` lockfile version 3.

Audit-time totals:

- Full tree: **19 affected packages** (10 high, 8 moderate, 1 low, 0 critical).
- Production-only: **1 affected package** (Hono; moderate).
- Tests: 5/5 passed.
- TypeScript check: passed.
- ESLint: passed.

| Package | Installed | Audit severity | Scope | Vulnerability class / remediation |
|---|---:|---|---|---|
| `hono` | 4.12.32 | Moderate | Runtime/direct | Four advisories; upgrade to >=4.12.34, preferably 4.13.3 after tests |
| `vite` | 7.3.0 | High | Dev/direct | Dev-server file-read/path issues; upgrade within major to >=7.3.5 (audit-time wanted 7.3.6) |
| `postcss` | 8.5.6 | High | Dev/direct | CSS source-map file disclosure/XSS; upgrade to audit-time wanted 8.5.26 |
| `wrangler` | 4.118.0 | Moderate | Dev/direct | Vulnerable Miniflare/Undici chain; upgrade to audit-time wanted 4.124.0 |
| `drizzle-kit` | 0.31.10 | Moderate | Dev/direct | Old `@esbuild-kit` chain; manually resolve/override or await upstream—do not blindly downgrade to npm's suggested 0.18.1 |
| `rollup` | 4.55.1 | High | Dev/transitive | Path-traversal arbitrary write; resolve to >=4.59.0 via Vite/lock update |
| `undici` | 7.28.0 | High | Dev/transitive | Cache disclosure/crash, desync, CRLF/cookie issues; resolve to >=7.29.0 via Wrangler/Miniflare |
| `miniflare` | 5.20260730.0-alpha | Moderate | Dev/transitive | Affected through Undici; update Wrangler/toolchain |
| `brace-expansion` | 1.1.12 | High | Dev/transitive | Multiple resource-exhaustion advisories; resolve to patched transitive releases |
| `flatted` | 3.3.3 | High | Dev/transitive | Recursion DoS/prototype pollution; resolve above 3.4.1 |
| `js-yaml` | 4.1.1 | High | Dev/transitive | Quadratic CPU; resolve to >=4.3.1 |
| `minimatch` | 3.1.2 | High | Dev/transitive | Multiple ReDoS issues; resolve to patched branch (>=3.1.4 for 3.x) |
| `nanoid` | 3.3.11 | High | Dev/transitive | Non-secure generator infinite loops; resolve to >=3.3.18 |
| `picomatch` | 4.0.3 | High | Dev/transitive | Method injection/ReDoS; resolve to >=4.0.4 |
| `ajv` | 6.12.6 | Moderate | Dev/transitive | `$data` ReDoS; resolve to >=6.14.0 or supported newer major |
| `esbuild` (nested) | <=0.24.2 affected chain | Moderate | Dev/transitive | Dev server cross-origin request/read; update Drizzle Kit chain |
| `@esbuild-kit/core-utils` | 3.3.2 | Moderate | Dev/transitive | Affected through nested esbuild; update/remove chain |
| `@esbuild-kit/esm-loader` | 2.6.5 | Moderate | Dev/transitive | Affected through core-utils; update/remove chain |
| `@babel/core` | 7.28.5 | Low | Dev/transitive | Source-map arbitrary file read; resolve above 7.29.0 |

No package was confirmed malicious. No direct package was reported deprecated by npm. Several direct packages were outdated, but major-version age alone was not treated as a vulnerability.

## 13. Secrets Scan

**CONFIRMED: no usable secret found in the current tree, built text artifacts, or high-confidence Git history scan.**

Coverage included source, JSON/YAML-like config, `.env.example`, Docker files, Wrangler config, lockfile, public/static output, and Git patches. Credential-like filenames consisted only of `.env.example`. Earlier `.env.example` history contained comment/placeholder examples, not usable values. No private key, cloud/API token, JWT-like token, credential-bearing live connection string, or production `.env` file was found.

The Cloudflare account ID, D1 database ID, application ID, domain, and email addresses in configuration are identifiers/contact data, not authentication secrets. They should not be confused with API tokens or Worker secrets.

The Dockerfile risk in U40-M04 remains important because a future real `.env` would be embedded in the image.

## 14. API Security and Endpoint Inventory

| Method | Endpoint | Purpose | Auth required | Authorization | Input validation | Rate limiting |
|---|---|---|---|---|---|---|
| GET | `/api/trpc/ping` | Health/time response | No | N/A | tRPC query shape | None in app |
| POST | `/api/trpc/admission.submit` | Store inquiry and email notification | No | N/A (public intake) | Server-side Zod schema | None in app |
| Any | `/api/trpc/*` | tRPC transport, including batching semantics | No global auth | Procedure-specific; all current procedures public | Procedure-specific | None in app |
| Any | `/api/*` unmatched | JSON 404 | No | N/A | N/A | None in app |
| GET/HEAD | Static asset/page paths | Public website | No | N/A | N/A | Cloudflare edge behavior |

- Output exposure: submission returns only reference code, submitted student name, and selected course; there is no record retrieval endpoint.
- Mass assignment: unknown fields are stripped by the Zod object before insert.
- Error handling: users receive a generic tRPC internal error message; raw internal errors may enter logs.
- CORS: no ACAO/credential policy is emitted; arbitrary browser origins are not accepted.
- CSRF: no authenticated ambient authority exists, so classic account-impacting CSRF is not applicable. Cross-site/scripted spam remains an abuse issue.
- HTTP methods: TRACE is rejected; tRPC handles procedure/method semantics.

## 15. Database Security

| Area | Result |
|---|---|
| Credentials | D1 binding; no database password/connection string in current deployment config |
| Query construction | Drizzle parameterized insert; no raw SQL sink found |
| Least privilege | Worker binding scope visible; Cloudflare account-level privileges **NOT TESTED** |
| Public exposure | No public D1 network endpoint or record-read API found |
| Stored PII | All form fields except consent, plus status/reference/timestamp |
| Logging | Raw errors may potentially contain context; see U40-L03 |
| Backups/encryption/dashboard access | **NOT TESTED**; not represented in repository |

Data minimization recommendation: reassess whether exact date of birth, full residential address, school, and previous percentage are all required at the initial counselling-call stage. Collect later-stage data only when operationally necessary.

## 16. Personal Data / Privacy Review

| Field | Purpose represented in UI | Storage | Transmission | Exposure risk |
|---|---|---|---|---|
| Student name | Identify prospective student | D1 | Email | Identity of likely minor |
| Guardian name | Contact/relationship | D1 | Email | Identity/contact association |
| Phone | Admissions callback | D1 | Email | Spam/social-engineering risk |
| Email | Optional contact/reply-to | D1 | Email header/body | Phishing and mailbox propagation |
| Date of birth | Not specifically justified at inquiry stage | D1 | Email | Minor identity/profile risk |
| Current class/course/board | Academic routing | D1 | Email | Education profile |
| School/percentage | Counselling context | D1 | Email | Education/performance profile |
| Residential address | Required by form | D1 | Email | Physical-location risk; potentially excessive for first contact |
| Message | User-selected context | D1 | Email | May contain unanticipated sensitive data |
| Consent | Permission to contact | Not stored | Not emailed | No durable evidence/version |

No browser storage, URL query-string placement, analytics forwarding, or client-side token persistence was found. The form state exists in React memory until submission/reset. Technical privacy risks are described here; legal compliance requires separate qualified review.

## 17. Security Headers, CORS, Cookies, and Sessions

### Headers

| Header/control | Status |
|---|---|
| `Strict-Transport-Security` | **CONFIRMED missing** |
| `Content-Security-Policy` | **CONFIRMED missing** |
| `X-Content-Type-Options` | **CONFIRMED missing** |
| `Referrer-Policy` | **CONFIRMED missing** |
| `Permissions-Policy` | **CONFIRMED missing** |
| `frame-ancestors` / `X-Frame-Options` | **CONFIRMED missing** |
| HTTP → HTTPS redirect | **CONFIRMED missing** |
| Mixed active content | **No instance found** |
| TLS certificate | **Valid at audit time** |

### CORS

No `Access-Control-Allow-Origin` header was observed with an arbitrary Origin, and preflight was not approved. This is appropriately restrictive for a same-origin API. Continue omitting CORS unless a specific trusted origin requires it; then allow an exact origin and only necessary methods/headers. Do not use wildcard origin with credentials.

### Cookies and sessions

**NOT APPLICABLE.** The app sets no cookie and implements no session/authentication. The tRPC client sends `credentials: "include"`, but no application cookie was observed. If authentication is later introduced, separately audit `Secure`, `HttpOnly`, `SameSite`, rotation, expiry, logout invalidation, and fixation resistance.

## 18. File Upload Security

**NOT APPLICABLE.** No file input, multipart handler, upload endpoint, or R2/file-storage binding exists.

## 19. AI Security

**NOT APPLICABLE.** No AI/LLM provider, prompt, RAG/vector database, model tool, or AI-authorized action exists.

## 20. Client-Side Security

- No secret or credential marker was found in source or built public assets.
- The internal API path is visible, as expected for any browser application.
- No source map was linked or retrievable at the adjacent deployed JS path.
- No `dangerouslySetInnerHTML`, direct `innerHTML`, `document.write`, `eval`, or dynamic function construction was found in application source.
- No local/session storage or cookie token use was found.
- Anything returned to the browser remains public; do not add service keys or privileged D1 access material to `VITE_*` variables.

## 21. OWASP ZAP / Dynamic Scan Status

**NOT TESTED with OWASP ZAP.** ZAP was not installed in the audit environment. In keeping with the no-aggressive-production-testing constraint, no alternative active scanner was launched.

Equivalent safe passive checks performed manually:

- Apex HTTP/HTTPS and `www` response headers/status
- TLS certificate identity and validity
- Public health query
- Arbitrary-Origin GET and CORS preflight behavior
- TRACE method response
- Deployed HTML resource references and mixed-content string review
- JavaScript source-map directive and adjacent map existence

Scanner-style false-positive note: deployed `http://www.w3.org/2000/svg` strings are XML namespace identifiers, not mixed-content network requests.

A future ZAP baseline scan should target staging first, use passive rules, exclude the admission mutation or point it to a disposable test D1/mailbox, and manually validate every alert.

## 22. OWASP Top 10 Mapping

| OWASP category | Status | Findings |
|---|---|---|
| A01 Broken Access Control | **NOT APPLICABLE / no exposure found** | No accounts/admin/read APIs; potential parallel `workers.dev` policy path (U40-M05) |
| A02 Cryptographic Failures | **FAIL** | Plain HTTP allowed and no HSTS (U40-H01); duplicated PII in email (U40-M02) |
| A03 Injection | **PASS for inspected paths** | Zod + Drizzle; no raw query/command/template sink; current output encoded |
| A04 Insecure Design | **FAIL** | No anti-automation/idempotency; 50 MiB public body limit (U40-H02, U40-M06) |
| A05 Security Misconfiguration | **FAIL** | Missing headers, HTTP enabled, potential workers.dev route, Docker `.env` design |
| A06 Vulnerable and Outdated Components | **FAIL** | Hono runtime advisory and development dependency findings |
| A07 Identification and Authentication Failures | **NOT APPLICABLE** | No authentication feature |
| A08 Software and Data Integrity Failures | **PARTIAL** | Lockfile present; vulnerable/niche build chain requires maintenance |
| A09 Security Logging and Monitoring Failures | **PARTIAL / NOT TESTED** | Raw error logging risk; alerting/Cloudflare log policy not visible |
| A10 SSRF | **PASS for inspected paths** | No user-controlled backend URL fetch; generic `HttpClient` is unused |

## 23. Recommended Remediation Priority

### P0 — Fix immediately

1. Enforce HTTP → HTTPS on apex and `www`; verify, then enable HSTS.
2. Protect `admission.submit` with server-verified Turnstile plus endpoint-specific rate limiting and duplicate/idempotency controls.
3. Reduce the API body limit from 50 MiB to a measured small JSON limit.

### P1 — Fix before production acceptance

1. Add and test CSP, frame protection, nosniff, referrer, and permissions headers.
2. Upgrade Hono to a patched compatible release.
3. Route/minimize admission email data and confirm access/retention aligns with the public notice.
4. Disable `workers_dev` for production or prove equivalent controls cover the hostname.
5. Remove `.env` from the Docker image design and `.dockerignore` it.

### P2 — Fix soon

1. Upgrade/re-resolve vulnerable development dependencies and rerun both audits.
2. Add semantic DOB, explicit email length, and control-character validation.
3. Store consent notice version/timestamp and implement retention/deletion workflows.
4. Redact and structure Worker error logging.

### P3 — Improvement

1. Remove unused Node/MySQL/env helpers and dependencies after workflow confirmation.
2. Remove the unnecessary public `ping` query if monitoring does not use it, or cache/rate it appropriately.
3. Add automated security regression tests for headers, body limits, Turnstile failure/replay, duplicate submission, schema edge cases, and email escaping.
4. Run a passive ZAP baseline against staging with disposable storage/email.

## 24. Final Production Readiness

### **NOT READY**

The finding is not **CRITICAL SECURITY ISSUES** because there is no demonstrated record disclosure, code execution, credential exposure, SQL injection, stored XSS, or authorization bypass. It is not ready because sensitive admission data can be submitted over plaintext HTTP and the write-plus-email endpoint has no effective automated-abuse protection. Once P0 items are verified and P1 items are addressed or explicitly risk-accepted, reassess the score and run a staging passive scan.

## Appendix A — Commands and Evidence Quality

Read-only/local commands included `rg`, `npm audit`, `npm outdated`, `npm test`, `npm run check`, `npm run lint`, local Zod parsing, Git history scanning with values suppressed, `curl` header/resource checks, DNS lookup, and a passive TLS certificate handshake.

No dependency was updated, no security fix was applied, no deployment/dashboard setting was changed, no production form mutation was called, and no secret value is reproduced in this report.
