import { describe, expect, it } from "vitest";
import {
  getCanonicalRedirect,
  getRequestHostname,
  withSecurityHeaders,
} from "./securityHeaders";

describe("security headers", () => {
  it("redirects HTTP and www requests to canonical HTTPS", () => {
    expect(
      getCanonicalRedirect(new Request("http://www.u40academy.com/privacy"))?.toString()
    ).toBe("https://u40academy.com/privacy");
    expect(getCanonicalRedirect(new Request("https://u40academy.com/"))).toBeNull();
    expect(getCanonicalRedirect(new Request("http://localhost:8787/"))).toBeNull();
    expect(
      getCanonicalRedirect(
        new Request("http://www.u40academy.com/", {
          headers: { Host: "localhost:8787" },
        })
      )
    ).toBeNull();
  });

  it("only accepts the proxy Host fallback outside Cloudflare's real edge", () => {
    expect(
      getRequestHostname(
        new Request("http://u40academy.com/", {
          headers: { Host: "localhost:8787" },
        })
      )
    ).toBe("localhost");

    expect(
      getRequestHostname(
        new Request("http://u40academy.com/", {
          headers: { "CF-Ray": "edge-request", Host: "localhost:8787" },
        })
      )
    ).toBe("u40academy.com");
  });

  it("adds browser defenses and API no-store headers", () => {
    const response = withSecurityHeaders(
      Response.json({ ok: true }),
      new Request("https://u40academy.com/api/trpc/ping")
    );

    expect(response.headers.get("strict-transport-security")).toBe(
      "max-age=31536000"
    );
    expect(response.headers.get("content-security-policy")).toContain(
      "frame-ancestors 'none'"
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });
});
