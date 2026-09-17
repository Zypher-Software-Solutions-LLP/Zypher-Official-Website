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
  RESEND_API_KEY: optionalString,
  CONTACT_TO_EMAIL: optionalEmail,
  CONTACT_FROM_EMAIL: optionalEmail,
  NEXT_PUBLIC_R2_MEDIA_BASE_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_R2_MEDIA_HOSTNAME: optionalString,
  NEXT_PUBLIC_SANITY_PROJECT_ID: optionalString,
  NEXT_PUBLIC_SANITY_DATASET: z.string().trim().min(1).default("production"),
  SANITY_API_READ_TOKEN: optionalString,
  SANITY_PREVIEW_SECRET: optionalString,
});

export type Environment = z.infer<typeof environmentSchema>;

export function getEnvironment(): Environment {
  const result = environmentSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error("Environment validation failed. Check the deployment configuration.");
  }

  return result.data;
}
