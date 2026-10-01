import { AppStoreComingSoon, GooglePlayButton } from "@/components/StoreButtons";
import { PRICING } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-title" className="bg-navy-950 pt-24 pb-20 text-center text-white sm:pt-28">
      <div className="container-page">
        <h2 id="final-cta-title" className="heading-section">
          Curious what your signs say about you?
        </h2>
        <p className="mt-4 text-white/60">Start your first reading for just ₹3.</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <GooglePlayButton tone="dark" label={PRICING.cta} />
          <AppStoreComingSoon tone="dark" />
        </div>
        <p className="mt-5 text-sm text-white/45">1-day trial · then ₹249/month · cancel anytime</p>
      </div>
    </section>
  );
}
