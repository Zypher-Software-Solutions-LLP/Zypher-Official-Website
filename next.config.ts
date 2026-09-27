import type { NextConfig } from "next";
import { createSecurityHeaders } from "./src/lib/security/content-security-policy";
import { validateProductionEnvironment } from "./src/lib/env";

const shouldValidateProductionEnvironment =
  process.env.VERCEL_ENV === "production" || process.env.VALIDATE_PRODUCTION_ENV === "true";

if (shouldValidateProductionEnvironment) {
  const validation = validateProductionEnvironment(process.env);
  if (!validation.ok) {
    throw new Error(
      `Production environment validation failed:\n- ${validation.issues.join("\n- ")}`,
    );
  }
}

const r2Hostname = process.env.NEXT_PUBLIC_R2_MEDIA_HOSTNAME;
const environment = process.env.NODE_ENV === "production" ? "production" : "development";
const r2ImagePattern = r2Hostname ? [{ protocol: "https" as const, hostname: r2Hostname }] : [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    qualities: [75, 100],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "media.zypher-solutions.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      ...r2ImagePattern,
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecurityHeaders({ environment, r2Hostname }),
      },
      {
        source: "/studio/:path*",
        headers: createSecurityHeaders({ environment, route: "studio", r2Hostname }).filter(
          ({ key }) => key === "X-Robots-Tag",
        ),
      },
      {
        source: "/api/:path*",
        headers: createSecurityHeaders({ environment, route: "api", r2Hostname }).filter(
          ({ key }) => key === "X-Robots-Tag",
        ),
      },
    ];
  },
  async redirects() {
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
      {
        source: "/services/ui-ux-design",
        destination: "/services/design-creative",
        permanent: true,
      },
      { source: "/terms-of-service", destination: "/terms-of-use", permanent: true },
    ];
  },
};

export default nextConfig;
