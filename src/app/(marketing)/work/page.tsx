import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { WorkHeroSection } from "@/features/work/WorkHeroSection";
import { WorkProjectsSection } from "@/features/work/WorkProjectsSection";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/work");
}

export default function WorkPage(): React.ReactNode {
  return (
    <main id="main-content">
      <WorkHeroSection />
      <WorkProjectsSection />
      <CallToActionSection />
    </main>
  );
}
