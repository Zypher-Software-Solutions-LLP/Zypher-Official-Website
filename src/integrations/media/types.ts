export type MediaAssetSource = "repository" | "sanity" | "r2";

export type MediaAsset = {
  source: MediaAssetSource;
  url?: string;
  key?: string;
  width: number;
  height: number;
  aspectRatio: number;
  alt: string;
  priority?: boolean;
  sizes?: string;
};
