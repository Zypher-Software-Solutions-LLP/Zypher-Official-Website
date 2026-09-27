export type SecurityEnvironment = "development" | "test" | "production";
export type SecurityHeaderRoute = "public" | "studio" | "api";

export type SecurityHeader = {
  key: string;
  value: string;
};

export type SecurityHeaderOptions = {
  environment?: SecurityEnvironment;
  route?: SecurityHeaderRoute;
  r2Hostname?: string;
};

const mediaSource = "https://media.zypher-solutions.com";

function normalizeHostname(hostname: string | undefined): string | null {
  const normalized = hostname?.trim().toLowerCase();

  if (!normalized || !/^[a-z0-9.-]+$/.test(normalized) || normalized.includes("..")) {
    return null;
  }

  return normalized.replace(/\.$/, "");
}

function buildContentSecurityPolicy({
  environment,
  r2Hostname,
}: Required<Pick<SecurityHeaderOptions, "environment">> &
  Pick<SecurityHeaderOptions, "r2Hostname">): string {
  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    ...(environment === "development" || environment === "test" ? ["'unsafe-eval'"] : []),
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://challenges.cloudflare.com",
    "https://app.cal.com",
  ];
  const imageSources = [
    "'self'",
    "data:",
    "blob:",
    "https://cdn.sanity.io",
    mediaSource,
    "https://www.google-analytics.com",
    "https://flagcdn.com",
  ];
  const normalizedR2Hostname = normalizeHostname(r2Hostname);

  if (normalizedR2Hostname) {
    imageSources.push(`https://${normalizedR2Hostname}`);
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources.join(" ")}`,
    "font-src 'self' data:",
    "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://*.sanity.io wss://*.sanity.io https://challenges.cloudflare.com https://app.cal.com",
    "frame-src https://www.googletagmanager.com https://challenges.cloudflare.com https://www.google.com https://maps.google.com https://app.cal.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(environment === "production" ? ["upgrade-insecure-requests"] : []),
  ];

  return `${directives.join("; ")};`;
}

export function createSecurityHeaders({
  environment = "production",
  route = "public",
  r2Hostname,
}: SecurityHeaderOptions = {}): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=()",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    },
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy({ environment, r2Hostname }),
    },
  ];

  if (route === "studio" || route === "api") {
    headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
  }

  return headers;
}
