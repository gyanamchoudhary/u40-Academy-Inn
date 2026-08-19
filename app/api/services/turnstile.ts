import { z } from "zod";

const responseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
  metadata: z
    .object({ result_with_testing_key: z.boolean().optional() })
    .optional(),
});

type VerifyTurnstileOptions = {
  secret: string;
  token: string;
  remoteIp?: string;
  expectedHostname: string;
  fetcher?: typeof fetch;
};

export type TurnstileVerification =
  | { valid: true }
  | {
      valid: false;
      reason:
        | "not_configured"
        | "provider_error"
        | "invalid_response"
        | "challenge_failed"
        | "hostname_mismatch"
        | "action_mismatch";
    };

export async function verifyAdmissionTurnstile({
  secret,
  token,
  remoteIp,
  expectedHostname,
  fetcher = fetch,
}: VerifyTurnstileOptions): Promise<TurnstileVerification> {
  if (!secret) return { valid: false, reason: "not_configured" };

  let response: Response;
  try {
    response = await fetcher(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip: remoteIp,
          idempotency_key: crypto.randomUUID(),
        }),
        signal: AbortSignal.timeout(5_000),
      }
    );
  } catch {
    return { valid: false, reason: "provider_error" };
  }

  if (!response.ok) return { valid: false, reason: "provider_error" };

  const parsed = responseSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) return { valid: false, reason: "invalid_response" };
  if (!parsed.data.success) return { valid: false, reason: "challenge_failed" };
  const localDevelopment =
    expectedHostname === "localhost" || expectedHostname === "127.0.0.1";

  // Cloudflare marks dummy-key responses explicitly. Permit their neutral
  // hostname/action response only on a local request, never on a public host.
  if (
    localDevelopment &&
    parsed.data.metadata?.result_with_testing_key === true
  ) {
    return { valid: true };
  }

  if (parsed.data.hostname !== expectedHostname) {
    return { valid: false, reason: "hostname_mismatch" };
  }
  const validAction =
    parsed.data.action === "admission_inquiry" ||
    (localDevelopment && parsed.data.action === "test");
  if (!validAction) {
    return { valid: false, reason: "action_mismatch" };
  }

  return { valid: true };
}
