import { SiteHeader } from "@/components/homepage/header";
import { Hero } from "@/components/homepage/hero";
import { StatStrip } from "@/components/homepage/stat-strip";
import { WhySection } from "@/components/homepage/why-section";
import { PedagogySection } from "@/components/homepage/pedagogy-section";
import { CurriculumPreview } from "@/components/homepage/curriculum-preview";
import { MotivationBanner } from "@/components/homepage/motivation-banner";
import { OpenSourceStrip } from "@/components/homepage/open-source-strip";
import { FinalCta } from "@/components/homepage/final-cta";
import { SiteFooter } from "@/components/homepage/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-bg text-ink">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <Hero />
        <StatStrip />
        <WhySection />
        <PedagogySection />
        <CurriculumPreview />
        <MotivationBanner />
        <OpenSourceStrip />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
