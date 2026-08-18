import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { createDb } from "./queries/connection";

export type WorkerEnv = {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMISSIONS_EMAIL: SendEmail;
};

export function createApp() {
  const app = new Hono<{ Bindings: WorkerEnv }>();

  app.use("/api/*", bodyLimit({ maxSize: 50 * 1024 * 1024 }));
  app.use("/api/trpc/*", async c => {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: opts =>
        createContext(opts, createDb(c.env.DB), c.env.ADMISSIONS_EMAIL),
    });
  });
  app.all("/api/*", c => c.json({ error: "Not Found" }, 404));

  // Non-API requests fall through to the static assets binding
  // (SPA fallback for any path without a matching asset).
  app.notFound(c => c.env.ASSETS.fetch(c.req.raw));

  return app;
}
