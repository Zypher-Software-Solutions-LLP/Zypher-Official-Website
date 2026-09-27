import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { AboutHeroSection } from "@/features/about/AboutHeroSection";
import { AboutFoundersSection } from "@/features/about/AboutFoundersSection";
import { AboutStorySection } from "@/features/about/AboutStorySection";
import { AboutTeamSection } from "@/features/about/AboutTeamSection";
import { AboutValuesSection } from "@/features/about/AboutValuesSection";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/about");
}

export default function AboutPage(): React.ReactNode {
  return (
    <main id="main-content">
      <AboutHeroSection />
      <AboutStorySection />
      <AboutValuesSection />
      <AboutFoundersSection />
      <AboutTeamSection />
      <CallToActionSection />
    </main>
  );
}
