export type SanityImage = {
  alt: string;
  asset?: { _ref?: string };
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author?: { name: string; role?: string };
  categories: string[];
  publishedAt: string;
  updatedAt?: string;
  image?: SanityImage;
  body: unknown[];
  seo?: { title?: string; description?: string };
};
