import type { NextConfig } from "next";

const r2Hostname = process.env.NEXT_PUBLIC_R2_MEDIA_HOSTNAME;
const r2ImagePattern = {
  protocol: "https" as const,
  hostname: r2Hostname || "*.r2.dev",
};
const r2Source = r2Hostname ? `https://${r2Hostname}` : "https://*.r2.dev";
const mediaSource = "https://media.zypher-solutions.com";

const securityHeaders = [
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
    key: "Content-Security-Policy-Report-Only",
    value: `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io ${mediaSource} ${r2Source} https://www.google-analytics.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.sanity.io https://challenges.cloudflare.com; frame-src https://www.googletagmanager.com https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`,
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "media.zypher-solutions.com" },
      r2ImagePattern,
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
