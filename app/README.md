# U40 Academy Inn website

React/Vite frontend and Hono/tRPC API deployed together as a Cloudflare Worker. Admission inquiries are validated with Zod, protected by Turnstile and a Cloudflare rate-limit binding, stored in D1 through Drizzle, and followed by a minimized callback notification through the Cloudflare Send Email binding.

## Local setup

```bash
npm ci
cp .dev.vars.example .dev.vars
```

Set `VITE_TURNSTILE_SITE_KEY` in `.env.local`. For local-only UI work, the frontend automatically uses Cloudflare's public always-pass test site key when Vite is in development mode. Put the matching Cloudflare test secret in `.dev.vars`; never reuse test keys in production.

Use `npm run cf:dev` for the full Worker/D1 path. `npm run dev` is suitable for frontend work but still requires Worker bindings for database-backed API calls.

## Required production configuration

Before deployment:

1. Create a Turnstile widget restricted to `u40academy.com` and `www.u40academy.com`, with action `admission_inquiry`.
2. Configure the public site key as `VITE_TURNSTILE_SITE_KEY` in the frontend build environment.
3. Set the secret without printing or committing it:

   ```bash
   npx wrangler secret put TURNSTILE_SECRET
   ```

4. Verify `u40academyadmission@gmail.com` is an active, verified destination for the Send Email binding.
5. Apply D1 migrations before deploying the Worker.

   ```bash
   npx wrangler d1 migrations apply u40-admissions --remote
   ```

   Migration SQL is reviewed and committed in `db/migrations/`. The vulnerable legacy Drizzle Kit CLI is intentionally not installed; schema changes require a reviewed SQL migration that is validated against a disposable D1 database before production.

6. Run the verification suite:

   ```bash
   npm test
   npm run check
   npm run lint
   npm run cf:check
   npm audit --omit=dev
   ```

The repository enforces HTTPS and security headers in Worker middleware, disables the `workers.dev` route, and runs the Worker before static assets. Dashboard-level WAF managed rules and account access policies should also be reviewed before deployment.

## Security operations

See [`SECURITY_OPERATIONS.md`](./SECURITY_OPERATIONS.md) for rate-limit behavior, secret rotation, logging, incident handling, and the required retention-policy decision.
