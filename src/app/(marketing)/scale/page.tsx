import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { ScaleEngagementSection } from "@/features/scale/ScaleEngagementSection";
import { ScaleHeroSection } from "@/features/scale/ScaleHeroSection";
import { ScaleIndustriesSection } from "@/features/scale/ScaleIndustriesSection";
import { ScaleProblemFitSection } from "@/features/scale/ScaleProblemFitSection";
import { ScaleTestimonialsSection } from "@/features/scale/ScaleTestimonialsSection";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/scale");
}

export default function ScalePage(): React.ReactNode {
  return (
    <main id="main-content">
      <ScaleHeroSection />
      <ScaleEngagementSection />
      <ScaleIndustriesSection />
      <ScaleProblemFitSection />
      <ScaleTestimonialsSection />
      <CallToActionSection />
    </main>
  );
}
