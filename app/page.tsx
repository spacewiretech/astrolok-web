import Hero from "@/components/Hero";
import ReadingIntro from "@/components/ReadingIntro";
import PalmReading from "@/components/PalmReading";
import FaceReading from "@/components/FaceReading";
import AstrologyReading from "@/components/AstrologyReading";
import ChatWithAstro from "@/components/ChatWithAstro";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import PricingFAQ from "@/components/PricingFAQ";
import FinalCTA from "@/components/FinalCTA";
import { homeJsonLd, serializeJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      {/* Organization, WebSite, MobileApplication and FAQPage (from the FAQ shown on this page) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd()) }} />
      <Hero />

      {/* Immersive band: each experience pins its own stage and releases when its section ends. */}
      <section id="readings" aria-labelledby="readings-title" className="bg-void">
        <ReadingIntro />
        <PalmReading />
        <FaceReading />
        <AstrologyReading />
        <ChatWithAstro />
      </section>

      <HowItWorks />
      <TrustSection />
      <PricingFAQ />
      <FinalCTA />
    </>
  );
}
