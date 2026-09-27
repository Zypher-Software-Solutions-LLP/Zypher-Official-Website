import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CareersHeroSection } from "@/features/careers/CareersHeroSection";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/careers");
}

export default function CareersPage(): ReactNode {
  return (
    <main id="main-content">
      <CareersHeroSection />
    </main>
  );
}
