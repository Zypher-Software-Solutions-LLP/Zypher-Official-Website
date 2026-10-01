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
const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const environment = process.env.NODE_ENV === "production" ? "production" : "development";
const imageCacheTtlSeconds = 31 * 24 * 60 * 60;
const r2ImagePattern = r2Hostname
  ? [{ protocol: "https" as const, hostname: r2Hostname, port: "", pathname: "/**", search: "" }]
  : [];
const sanityImagePattern = sanityProjectId
  ? [
      {
        protocol: "https" as const,
        hostname: "cdn.sanity.io",
        port: "",
        pathname: `/images/${sanityProjectId}/${sanityDataset}/**`,
        search: "",
      },
    ]
  : [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Marketing assets use stable URLs. Change an R2 URL or purge its cache when replacing a file.
    minimumCacheTTL: imageCacheTtlSeconds,
    qualities: [75, 100],
    localPatterns: [{ pathname: "/home/section-1/background-illustration.png", search: "" }],
    remotePatterns: [
      ...sanityImagePattern,
      {
        protocol: "https",
        hostname: "media.zypher-solutions.com",
        port: "",
        pathname: "/**",
        search: "",
      },
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
