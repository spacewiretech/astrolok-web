import { Check } from "lucide-react";
import { GooglePlayButton } from "@/components/StoreButtons";
import { PRICING, PRICING_FEATURES } from "@/lib/constants";

/** Left half of the pricing + FAQ band: the plan as a navy card on cream. Rendered inside <PricingFAQ>. */
export default function Pricing({ className }: { className?: string }) {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className={className}>
      <h2 id="pricing-title" className="heading-section text-navy-950 lg:text-[2.75rem]">
        Try AstroLok for just ₹3.
      </h2>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        Apni first reading ₹3 mein try karein. Continue only if you want to.
      </p>

      <div className="mt-8 max-w-md rounded-3xl bg-navy-950 p-7 text-white sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h3 className="font-display text-lg font-semibold">{PRICING.plan}</h3>
            <p className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-5xl leading-none font-bold tracking-tight text-gold">
                <span className="sr-only">Trial price </span>
                {PRICING.trialPrice}
              </span>
              <s className="text-lg text-white/45">
                <span className="sr-only">Regular price </span>
                {PRICING.listPrice}
              </s>
            </p>
          </div>
          <p className="pb-1 text-sm text-white/65">{PRICING.renewal}</p>
        </div>

        <ul className="mt-6 grid gap-x-4 gap-y-2.5 border-t border-white/10 pt-6 sm:grid-cols-2">
          {PRICING_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[0.9375rem] text-white/85">
              <Check className="mt-1 size-4 shrink-0 text-gold" strokeWidth={3} aria-hidden />
              {feature}
            </li>
          ))}
        </ul>

        <GooglePlayButton tone="dark" label={PRICING.cta} className="mt-7 w-full justify-center" />
        <p className="mt-3 text-center text-sm text-white/55">
          {PRICING.note}
          <span className="mt-0.5 block text-white/40">App Store coming soon</span>
        </p>
      </div>
    </section>
  );
}
