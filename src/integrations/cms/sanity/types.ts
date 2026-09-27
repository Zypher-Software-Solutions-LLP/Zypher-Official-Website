export type SanityImage = {
  alt: string;
  url: string;
  width?: number;
  height?: number;
};

export type BlogCategory = {
  title: string;
  slug: string;
  description?: string;
};

export type BlogAuthor = {
  name: string;
  url?: string;
  role?: string;
  bio?: string;
  image?: SanityImage;
};

export type StaticPageSeo = {
  id: string;
  path: string;
  title: string;
  description: string;
  socialImage?: SanityImage;
  noIndex?: boolean;
  noFollow?: boolean;
};

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: BlogAuthor;
  categories: BlogCategory[];
  publishedAt: string;
  updatedAt: string;
  image?: SanityImage;
  seo?: { title?: string; description?: string };
};

export type PortableTextBlock = {
  _key?: string;
  _type: string;
  children?: Array<{ _key?: string; _type: "span"; text: string; marks?: string[] }>;
  style?: string;
  listItem?: string;
  level?: number;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number } } };
  alt?: string;
};

export type BlogPostDetail = BlogPostSummary & {
  body: PortableTextBlock[];
};

export type BlogPost = BlogPostDetail;

export type BlogQueryResult<T> =
  | { status: "ok"; data: T }
  | { status: "unconfigured"; data: null }
  | { status: "error"; data: null; message: string };

export type BlogSort = "newest" | "oldest";

export type BlogPostsQuery = {
  page: number;
  pageSize?: number;
  categorySlug?: string;
  sort?: BlogSort;
  heroPostId?: string;
  preview?: boolean;
};

export type PaginatedBlogPosts = {
  items: BlogPostSummary[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type BlogSitemapEntry = {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  image?: SanityImage;
};
