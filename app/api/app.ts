import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { createDb } from "./queries/connection";
import { getCanonicalRedirect, withSecurityHeaders } from "./securityHeaders";

type WorkerEnv = Env & { TURNSTILE_SECRET: string };

export function createApp() {
  const app = new Hono<{ Bindings: WorkerEnv }>();

  app.use("*", async (c, next) => {
    const redirect = getCanonicalRedirect(c.req.raw);
    if (redirect) {
      return withSecurityHeaders(
        new Response(null, { status: 308, headers: { Location: redirect.toString() } }),
        c.req.raw
      );
    }

    await next();
    c.res = withSecurityHeaders(c.res, c.req.raw);
  });

  app.use(
    "/api/*",
    bodyLimit({
      maxSize: 16 * 1024,
      onError: c => c.json({ error: "Request body too large" }, 413),
    })
  );
  app.use("/api/trpc/*", async c => {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: opts =>
        createContext(
          opts,
          createDb(c.env.DB),
          c.env.ADMISSIONS_EMAIL,
          c.env.ADMISSION_RATE_LIMITER,
          c.env.TURNSTILE_SECRET,
          c.executionCtx
        ),
    });
  });
  app.all("/api/*", c => c.json({ error: "Not Found" }, 404));

  // Non-API requests fall through to the static assets binding
  // (SPA fallback for any path without a matching asset).
  app.notFound(c => c.env.ASSETS.fetch(c.req.raw));

  return app;
}
