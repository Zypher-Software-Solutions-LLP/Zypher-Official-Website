import type { Metadata } from "next";
import { getStaticPageSeo } from "@/integrations/cms/sanity/queries";
import type { BlogPostDetail, StaticPageSeo } from "@/integrations/cms/sanity/types";

export const SITE_NAME = "Zypher Software Solutions";
export const SITE_DESCRIPTION =
  "Software development, automation, CRM/ERP, mobile, and UI/UX solutions for teams ready to scale.";
export const DEFAULT_SOCIAL_IMAGE_PATH = "/og/zypher-social-preview.png";
export const DEFAULT_SOCIAL_IMAGE_ALT = SITE_NAME;
export const DEFAULT_SOCIAL_IMAGE_WIDTH = 1200;
export const DEFAULT_SOCIAL_IMAGE_HEIGHT = 630;

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  noFollow?: boolean;
  imagePath?: string;
  image?: BlogMetadataImage;
  titleIsFinal?: boolean;
};

export type BlogMetadataImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export function getSiteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const title =
    input.title === "Zypher" || input.titleIsFinal ? input.title : `${input.title} | ${SITE_NAME}`;
  const imageUrl = absoluteUrl(input.imagePath || DEFAULT_SOCIAL_IMAGE_PATH);
  const image = input.image || {
    url: imageUrl,
    alt: DEFAULT_SOCIAL_IMAGE_ALT,
    width: DEFAULT_SOCIAL_IMAGE_WIDTH,
    height: DEFAULT_SOCIAL_IMAGE_HEIGHT,
  };
  const shouldFollow =
    input.noFollow === true ? false : input.noIndex ? input.noFollow === false : true;

  return {
    metadataBase: getSiteUrl(),
    title,
    description: input.description,
    alternates: { canonical: absoluteUrl(input.path) },
    robots: { index: input.noIndex !== true, follow: shouldFollow },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: input.description,
      url: absoluteUrl(input.path),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [image.url],
    },
  };
}

export type StaticPageMetadataOptions = {
  noIndex?: boolean;
  noFollow?: boolean;
  preview?: boolean;
};

function staticPageFallback(path: string, options: StaticPageMetadataOptions): Metadata {
  return buildPageMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path,
    noIndex: options.noIndex,
    noFollow: options.noFollow,
    titleIsFinal: true,
  });
}

function metadataFromStaticPageSeo(
  page: StaticPageSeo,
  path: string,
  options: StaticPageMetadataOptions,
): Metadata {
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path,
    noIndex: options.noIndex ?? page.noIndex,
    noFollow: options.noFollow ?? page.noFollow,
    image: page.socialImage,
    titleIsFinal: true,
  });
}

export async function getStaticPageMetadata(
  path: string,
  options: StaticPageMetadataOptions = {},
): Promise<Metadata> {
  const result = await getStaticPageSeo(path, { preview: options.preview });
  if (result.status === "ok" && result.data) {
    return metadataFromStaticPageSeo(result.data, path, options);
  }

  return staticPageFallback(path, options);
}

export function buildBlogPostMetadata(
  post: BlogPostDetail,
  noIndex = false,
  noFollow = noIndex,
): Metadata {
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt;
  const image = post.image
    ? {
        url: post.image.url,
        alt: post.image.alt,
        ...(post.image.width ? { width: post.image.width } : {}),
        ...(post.image.height ? { height: post.image.height } : {}),
      }
    : { url: absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH) };
  const metadata = buildPageMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    noIndex,
    noFollow,
    titleIsFinal: Boolean(post.seo?.title),
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [image],
    },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      images: [image.url],
    },
  };
}
