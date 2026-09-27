import type { Metadata } from "next";
import { HomePage } from "@/features/home/HomePage";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/");
}

export default function Page(): React.ReactNode {
  return <HomePage />;
}
