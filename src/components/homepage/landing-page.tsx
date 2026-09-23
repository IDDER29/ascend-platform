import { SiteHeader } from "@/components/homepage/header";
import { Hero } from "@/components/homepage/hero";
import { CurriculumPreview } from "@/components/homepage/curriculum-preview";
import { ExploreExperience } from "@/components/homepage/explore-experience";
import { LessonFeel } from "@/components/homepage/lesson-feel";
import { PedagogySection } from "@/components/homepage/pedagogy-section";
import { WhySection } from "@/components/homepage/why-section";
import { OpenSourceStrip } from "@/components/homepage/open-source-strip";
import { FinalCta } from "@/components/homepage/final-cta";
import { SiteFooter } from "@/components/homepage/footer";

/** Phosphor landing — single locked theme (no purple). */
export function LandingPage() {
  return (
    <div className="theme-phosphor flex min-w-0 flex-1 flex-col overflow-x-clip bg-bg text-ink">
      <SiteHeader />
      <main className="min-w-0">
        <Hero />
        <CurriculumPreview />
        <ExploreExperience />
        <LessonFeel />
        <PedagogySection />
        <WhySection />
        <OpenSourceStrip />
        <div className="mx-auto w-full min-w-0 max-w-[1200px] px-4 pb-12 sm:px-8 sm:pb-16">
          <FinalCta />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
