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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-bg text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <CurriculumPreview />
        <ExploreExperience />
        <LessonFeel />
        <PedagogySection />
        <WhySection />
        <OpenSourceStrip />
        <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
          <FinalCta />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
