import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Database } from "./queries/connection";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  db: Database;
  admissionsEmail: SendEmail;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
  db: Database,
  admissionsEmail: SendEmail
): Promise<TrpcContext> {
  return { req: opts.req, resHeaders: opts.resHeaders, db, admissionsEmail };
}
