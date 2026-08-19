const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'none'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src https://challenges.cloudflare.com",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "upgrade-insecure-requests",
  ].join("; "),
  "Permissions-Policy":
    "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

export function getCanonicalRedirect(request: Request): URL | null {
  const current = new URL(request.url);
  const redirect = new URL(current);
  let changed = false;

  const localDevelopment = isLocalDevelopmentRequest(request);

  if (current.protocol === "http:" && !localDevelopment) {
    redirect.protocol = "https:";
    changed = true;
  }

  if (current.hostname === "www.u40academy.com" && !localDevelopment) {
    redirect.hostname = "u40academy.com";
    changed = true;
  }

  return changed ? redirect : null;
}

export function getRequestHostname(request: Request): string {
  const currentHostname = new URL(request.url).hostname.toLowerCase();

  // Wrangler may preserve the configured production URL internally while its
  // local proxy exposes localhost. Cloudflare adds CF-Ray at the real edge, so
  // only trust the Host-header fallback when the request is demonstrably local.
  if (!request.headers.has("CF-Ray")) {
    const hostHeader = request.headers.get("Host")?.toLowerCase() ?? "";
    const hostWithoutPort = hostHeader.replace(/^\[|\](:\d+)?$/g, "").split(":")[0];

    if (hostWithoutPort === "localhost" || hostWithoutPort === "127.0.0.1") {
      return hostWithoutPort;
    }
  }

  return currentHostname;
}

function isLocalDevelopmentRequest(request: Request): boolean {
  const hostname = getRequestHostname(request);
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function withSecurityHeaders(
  response: Response,
  request: Request
): Response {
  const secured = new Response(response.body, response);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }

  if (new URL(request.url).protocol === "https:") {
    secured.headers.set("Strict-Transport-Security", "max-age=31536000");
  }

  if (new URL(request.url).pathname.startsWith("/api/")) {
    secured.headers.set("Cache-Control", "no-store");
    secured.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return secured;
}
