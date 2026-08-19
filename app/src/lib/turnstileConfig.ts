const DEVELOPMENT_SITE_KEY = "1x00000000000000000000AA";
const configuredSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();

export const turnstileSiteKey =
  configuredSiteKey || (import.meta.env.DEV ? DEVELOPMENT_SITE_KEY : "");

export const isTurnstileConfigured = Boolean(turnstileSiteKey);
