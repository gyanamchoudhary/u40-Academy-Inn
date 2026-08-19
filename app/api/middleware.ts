import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    const data = { ...shape.data };
    delete data.stack;

    return {
      ...shape,
      data,
    };
  },
});

export const createRouter = t.router;
export const publicQuery = t.procedure;
