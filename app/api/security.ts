import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./context";
import { getRequestHostname } from "./securityHeaders";
import { verifyAdmissionTurnstile } from "./services/turnstile";

const PRODUCTION_HOSTNAMES = new Set([
  "u40academy.com",
  "www.u40academy.com",
]);

function isAllowedOrigin(origin: string, requestUrl: URL, requestHostname: string) {
  try {
    const parsed = new URL(origin);
    if (parsed.origin === requestUrl.origin) return true;

    return (
      (requestHostname === "localhost" || requestHostname === "127.0.0.1") &&
      parsed.hostname === requestHostname
    );
  } catch {
    return false;
  }
}

async function hashRateLimitKey(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(digest), byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export async function enforceAdmissionSecurity(ctx: TrpcContext, token: string) {
  const requestUrl = new URL(ctx.req.url);
  const requestHostname = getRequestHostname(ctx.req);
  const origin = ctx.req.headers.get("Origin");

  if (origin && !isAllowedOrigin(origin, requestUrl, requestHostname)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Request origin rejected." });
  }

  const clientIp = ctx.req.headers.get("CF-Connecting-IP") ?? "unknown-client";
  const rateLimitKey = await hashRateLimitKey(`admission:${clientIp}`);
  const rateLimit = await ctx.admissionRateLimiter.limit({ key: rateLimitKey });

  if (!rateLimit.success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many inquiries were sent. Please wait and try again.",
    });
  }

  if (
    !PRODUCTION_HOSTNAMES.has(requestHostname) &&
    requestHostname !== "localhost" &&
    requestHostname !== "127.0.0.1"
  ) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Request host rejected." });
  }

  const verification = await verifyAdmissionTurnstile({
    secret: ctx.turnstileSecret,
    token,
    remoteIp: clientIp === "unknown-client" ? undefined : clientIp,
    expectedHostname: requestHostname,
  });

  if (!verification.valid) {
    const configurationFailure = verification.reason === "not_configured";
    console.error(
      JSON.stringify({
        event: "turnstile_verification_failed",
        reason: verification.reason,
      })
    );
    throw new TRPCError({
      code: configurationFailure ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST",
      message: configurationFailure
        ? "The inquiry form is temporarily unavailable."
        : "The security check failed. Refresh it and try again.",
    });
  }
}
