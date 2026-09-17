import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExecutionGapSection } from "@/features/home/ExecutionGapSection";
import { FaqSection } from "@/features/home/FaqSection";
import { HeroSection } from "@/features/home/HeroSection";
import { HowWeWorkSection } from "@/features/home/HowWeWorkSection";
import { ScaleSection } from "@/features/home/ScaleSection";
import { SolutionsSection } from "@/features/home/SolutionsSection";

export function HomePage(): React.ReactNode {
  return (
    <main id="main-content">
      <HeroSection />
      <ScaleSection />
      <ExecutionGapSection />
      <SolutionsSection />
      <HowWeWorkSection />
      <FaqSection />

      <section className="border-y border-mist-300/10 bg-ink-900/50">
        <div className="site-container grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <SectionHeading
            eyebrow="How we think"
            title={
              <>
                Clarity is a <span className="text-violet-300">growth advantage.</span>
              </>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-mist-300/15 p-6">
              <p className="text-4xl font-semibold text-cyan-300">01</p>
              <h3 className="mt-8 text-lg font-semibold text-mist-100">Understand first</h3>
              <p className="mt-3 text-sm leading-6 text-mist-300">
                The best solution starts with the real problem, not the loudest technology.
              </p>
            </div>
            <div className="rounded-3xl border border-mist-300/15 p-6">
              <p className="text-4xl font-semibold text-violet-300">02</p>
              <h3 className="mt-8 text-lg font-semibold text-mist-100">Build for change</h3>
              <p className="mt-3 text-sm leading-6 text-mist-300">
                Good systems create room for better decisions, new ideas, and steady momentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-24 sm:py-32">
        <div className="glass-panel rounded-[2rem] p-8 sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="eyebrow">Find your fit</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-mist-100 sm:text-5xl">
              Ready to see whether Zypher is the right partner for your next stage?
            </h2>
          </div>
          <ButtonLink className="mt-8 shrink-0 lg:mt-0" href="/scale">
            Explore Scale
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
