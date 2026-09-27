import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { ExecutionGapSection } from "@/features/home/execution-gap/ExecutionGapSection";
import { FaqSection } from "@/features/home/faq/FaqSection";
import { HeroSection } from "@/features/home/hero/HeroSection";
import { HowWeWorkSection } from "@/features/home/how-we-work/HowWeWorkSection";
import { ScaleSection } from "@/features/home/scale/ScaleSection";
import { SolutionsSection } from "@/features/home/solutions/SolutionsSection";
import styles from "./HomePage.module.css";

export function HomePage(): React.ReactNode {
  return (
    <main className={styles.homePage} id="main-content">
      <HeroSection />
      <ScaleSection />
      <ExecutionGapSection />
      <SolutionsSection />
      <HowWeWorkSection />
      <FaqSection />
      <CallToActionSection />
    </main>
  );
}
