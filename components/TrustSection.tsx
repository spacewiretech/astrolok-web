import Link from "next/link";
import { TRUST_POINTS } from "@/lib/constants";

/** Compact editorial block: the statement in one row, the facts behind it side by side. */
export default function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className="bg-white py-14 sm:py-16">
      <div className="container-page">
        <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end lg:gap-12">
          <h2 id="trust-title" className="heading-section text-navy-950 lg:text-[2.75rem]">
            Your reading is personal. Your data should be too.
          </h2>
          <p className="leading-relaxed text-muted lg:pb-1">
            AstroLok sirf wahi information maangta hai jo reading ke liye zaroori hai.{" "}
            <Link
              href="/privacy"
              className="font-semibold whitespace-nowrap text-navy-950 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold-dark"
            >
              Read the Privacy Policy
            </Link>
          </p>
        </div>

        <dl className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8 lg:mt-10">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="border-t border-line pt-4">
              <dt className="font-display font-semibold text-navy-950">{point.title}</dt>
              <dd className="mt-1.5 leading-relaxed text-muted">{point.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
