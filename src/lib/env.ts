import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const optionalEmail = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().email().optional(),
);

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_GTM_ID: optionalString,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,
  TURNSTILE_HOSTNAMES: optionalString,
  RESEND_API_KEY: optionalString,
  CONTACT_TO_EMAIL: optionalEmail,
  CONTACT_FROM_EMAIL: optionalEmail,
  NEXT_PUBLIC_R2_MEDIA_HOSTNAME: optionalString,
  NEXT_PUBLIC_SANITY_PROJECT_ID: optionalString,
  NEXT_PUBLIC_SANITY_DATASET: z.string().trim().min(1).default("production"),
  SANITY_API_READ_TOKEN: optionalString,
  SANITY_PREVIEW_SECRET: optionalString,
  SANITY_REVALIDATE_SECRET: optionalString,
});

export type Environment = z.infer<typeof environmentSchema>;

export type ProductionEnvironmentValidationResult = {
  ok: boolean;
  issues: string[];
};

const RESERVED_TURNSTILE_CREDENTIALS = new Set([
  "1x00000000000000000000aa",
  "2x00000000000000000000ab",
  "3x00000000000000000000ff",
  "4x00000000000000000000aa",
  "1x0000000000000000000000000000000aa",
  "2x0000000000000000000000000000000ab",
  "3x0000000000000000000000000000000ff",
  "4x0000000000000000000000000000000aa",
]);

function getConfiguredValue(
  environment: Readonly<Record<string, string | undefined>>,
  variableName: string,
): string | undefined {
  const value = environment[variableName]?.trim();
  return value ? value : undefined;
}

function isLocalHostname(hostname: string): boolean {
  const normalizedHostname = hostname.toLowerCase();
  return (
    normalizedHostname === "localhost" ||
    normalizedHostname.endsWith(".localhost") ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname.startsWith("127.") ||
    normalizedHostname === "[::1]"
  );
}

function isValidHostname(hostname: string): boolean {
  if (
    hostname.length > 253 ||
    hostname.includes("..") ||
    hostname.startsWith(".") ||
    hostname.endsWith(".") ||
    !hostname.includes(".")
  ) {
    return false;
  }

  return hostname
    .split(".")
    .every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
}

function isReservedTurnstileCredential(value: string | undefined): boolean {
  return value !== undefined && RESERVED_TURNSTILE_CREDENTIALS.has(value.toLowerCase());
}

function addRequiredIssue(
  issues: string[],
  environment: Readonly<Record<string, string | undefined>>,
  variableName: string,
): string | undefined {
  const value = getConfiguredValue(environment, variableName);
  if (!value) issues.push(`${variableName} must be configured in production.`);
  return value;
}

export function validateProductionEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): ProductionEnvironmentValidationResult {
  const issues: string[] = [];
  const siteUrlValue = addRequiredIssue(issues, environment, "NEXT_PUBLIC_SITE_URL");

  if (siteUrlValue) {
    try {
      const siteUrl = new URL(siteUrlValue);
      if (siteUrl.protocol !== "https:") {
        issues.push("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
      }
      if (isLocalHostname(siteUrl.hostname) || siteUrl.username || siteUrl.password) {
        issues.push("NEXT_PUBLIC_SITE_URL must point to a public hostname without credentials.");
      }
    } catch {
      issues.push("NEXT_PUBLIC_SITE_URL must be a valid URL.");
    }
  }

  const sanityProjectId = addRequiredIssue(issues, environment, "NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (sanityProjectId && !/^[a-z0-9-]+$/i.test(sanityProjectId)) {
    issues.push("NEXT_PUBLIC_SANITY_PROJECT_ID must contain only letters, numbers, and hyphens.");
  }

  const sanityDataset = addRequiredIssue(issues, environment, "NEXT_PUBLIC_SANITY_DATASET");
  if (sanityDataset && !/^[a-z0-9_-]+$/i.test(sanityDataset)) {
    issues.push("NEXT_PUBLIC_SANITY_DATASET contains invalid characters.");
  }

  for (const variableName of ["SANITY_PREVIEW_SECRET", "SANITY_REVALIDATE_SECRET"]) {
    const value = addRequiredIssue(issues, environment, variableName);
    if (value && value.length < 32) {
      issues.push(`${variableName} must be at least 32 characters long.`);
    }
  }

  const turnstileSiteKey = addRequiredIssue(issues, environment, "NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  const turnstileSecret = addRequiredIssue(issues, environment, "TURNSTILE_SECRET_KEY");
  if (isReservedTurnstileCredential(turnstileSiteKey)) {
    issues.push("NEXT_PUBLIC_TURNSTILE_SITE_KEY must not use a Cloudflare test credential.");
  }
  if (isReservedTurnstileCredential(turnstileSecret)) {
    issues.push("TURNSTILE_SECRET_KEY must not use a Cloudflare test credential.");
  }

  const turnstileHostnames = addRequiredIssue(issues, environment, "TURNSTILE_HOSTNAMES");
  if (turnstileHostnames) {
    const hostnames = turnstileHostnames
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean);

    if (hostnames.length === 0) {
      issues.push("TURNSTILE_HOSTNAMES must include at least one production hostname.");
    }

    for (const hostname of hostnames) {
      if (!isValidHostname(hostname) || isLocalHostname(hostname)) {
        issues.push(`TURNSTILE_HOSTNAMES contains an invalid production hostname: ${hostname}.`);
      }
    }
  }

  addRequiredIssue(issues, environment, "RESEND_API_KEY");
  const contactToEmail = addRequiredIssue(issues, environment, "CONTACT_TO_EMAIL");
  const contactFromEmail = addRequiredIssue(issues, environment, "CONTACT_FROM_EMAIL");

  for (const [variableName, value] of [
    ["CONTACT_TO_EMAIL", contactToEmail],
    ["CONTACT_FROM_EMAIL", contactFromEmail],
  ] as const) {
    if (value && !z.string().email().safeParse(value).success) {
      issues.push(`${variableName} must be a valid email address.`);
    }
  }

  const r2Hostname = getConfiguredValue(environment, "NEXT_PUBLIC_R2_MEDIA_HOSTNAME");
  if (r2Hostname && (!isValidHostname(r2Hostname) || isLocalHostname(r2Hostname))) {
    issues.push("NEXT_PUBLIC_R2_MEDIA_HOSTNAME must be a valid public hostname when configured.");
  }

  return { ok: issues.length === 0, issues };
}

export function getEnvironment(): Environment {
  const result = environmentSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error("Environment validation failed. Check the deployment configuration.");
  }

  return result.data;
}
