import { describe, expect, it } from "vitest";
import { verifyAdmissionTurnstile } from "./turnstile";

const base = {
  secret: "test-secret",
  token: "test-token",
  remoteIp: "192.0.2.1",
  expectedHostname: "u40academy.com",
};

describe("Turnstile verification", () => {
  it("requires success, the expected hostname, and the admission action", async () => {
    const result = await verifyAdmissionTurnstile({
      ...base,
      fetcher: async () =>
        Response.json({
          success: true,
          hostname: "u40academy.com",
          action: "admission_inquiry",
        }),
    });

    expect(result).toEqual({ valid: true });
  });

  it("fails closed on hostname mismatch or provider errors", async () => {
    const mismatch = await verifyAdmissionTurnstile({
      ...base,
      fetcher: async () =>
        Response.json({
          success: true,
          hostname: "attacker.invalid",
          action: "admission_inquiry",
        }),
    });
    const providerError = await verifyAdmissionTurnstile({
      ...base,
      fetcher: async () => new Response(null, { status: 503 }),
    });

    expect(mismatch).toEqual({ valid: false, reason: "hostname_mismatch" });
    expect(providerError).toEqual({ valid: false, reason: "provider_error" });
  });

  it("fails closed when the Worker secret is missing", async () => {
    expect(
      await verifyAdmissionTurnstile({ ...base, secret: "" })
    ).toEqual({ valid: false, reason: "not_configured" });
  });

  it("allows Cloudflare's documented test action only on local hosts", async () => {
    const local = await verifyAdmissionTurnstile({
      ...base,
      expectedHostname: "localhost",
      fetcher: async () =>
        Response.json({ success: true, hostname: "localhost", action: "test" }),
    });
    const production = await verifyAdmissionTurnstile({
      ...base,
      fetcher: async () =>
        Response.json({ success: true, hostname: "u40academy.com", action: "test" }),
    });

    expect(local).toEqual({ valid: true });
    expect(production).toEqual({ valid: false, reason: "action_mismatch" });
  });

  it("accepts a provider-marked dummy response only for local development", async () => {
    const testResponse = () =>
      Response.json({
        success: true,
        hostname: "example.com",
        metadata: { result_with_testing_key: true },
      });
    const local = await verifyAdmissionTurnstile({
      ...base,
      expectedHostname: "localhost",
      fetcher: async () => testResponse(),
    });
    const production = await verifyAdmissionTurnstile({
      ...base,
      fetcher: async () => testResponse(),
    });

    expect(local).toEqual({ valid: true });
    expect(production).toEqual({ valid: false, reason: "hostname_mismatch" });
  });
});
