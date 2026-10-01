import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";

/**
 * Pricing and FAQ share one screen on a single cream band: the plan (a navy card) on the
 * left, questions on the right. One background keeps clean edges against the white trust
 * section above and the navy closing section below. On phones the two stack.
 */
export default function PricingFAQ() {
  return (
    <div className="bg-cream py-14 sm:py-16">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-16">
        <Pricing />
        <FAQ embedded />
      </div>
    </div>
  );
}
