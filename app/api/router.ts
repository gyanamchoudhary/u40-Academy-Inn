import { createRouter, publicQuery } from "./middleware";
import { admissionRouter } from "./admissionRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  admission: admissionRouter,
});

export type AppRouter = typeof appRouter;
