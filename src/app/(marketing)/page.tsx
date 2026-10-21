import type { Metadata } from "next";
import { faqItems } from "@/features/home/faq/faq-data";
import { HomePage } from "@/features/home/HomePage";
import { FaqJsonLd } from "@/lib/schema";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/");
}

export default function Page(): React.ReactNode {
  return (
    <>
      <FaqJsonLd items={faqItems} />
      <HomePage />
    </>
  );
}
