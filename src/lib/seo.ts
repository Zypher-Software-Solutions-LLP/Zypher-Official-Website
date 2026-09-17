import type { Metadata } from "next";

export const SITE_NAME = "Zypher Software Solutions";
export const SITE_DESCRIPTION =
  "Software development, automation, CRM/ERP, mobile, and UI/UX solutions for teams ready to scale.";
export const DEFAULT_SOCIAL_IMAGE_PATH = "/og/zypher-social-preview.png";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  imagePath?: string;
};

export function getSiteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const title = input.title === "Zypher" ? input.title : `${input.title} | ${SITE_NAME}`;
  const imageUrl = absoluteUrl(input.imagePath || DEFAULT_SOCIAL_IMAGE_PATH);

  return {
    metadataBase: getSiteUrl(),
    title,
    description: input.description,
    alternates: { canonical: absoluteUrl(input.path) },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: input.description,
      url: absoluteUrl(input.path),
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [imageUrl],
    },
  };
}
