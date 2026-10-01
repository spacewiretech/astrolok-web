import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { SITE } from "@/lib/constants";
import type { LegalDocument } from "@/lib/legal";

export default function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <article className="bg-white">
      <header className="border-b border-line/70 bg-cream">
        <div className="container-page max-w-3xl! py-14 sm:py-20">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-950">
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
          <h1 className="mt-8 font-display text-4xl leading-tight font-semibold tracking-[-0.02em] text-navy-950 sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{doc.intro}</p>
        </div>
      </header>

      <div className="container-page max-w-3xl! py-12 sm:py-16">
        {doc.draft && (
          <div role="note" className="mb-12 flex gap-3 rounded-2xl border border-gold/40 bg-cream p-5 text-[0.9375rem] leading-relaxed text-navy-950/80">
            <Info className="mt-0.5 size-5 shrink-0 text-gold-dark" aria-hidden />
            <p>
              This page is being finalised. The outline below shows what it covers; the full text will be published here.
              For any question in the meantime, write to{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-gold-dark underline-offset-4 hover:underline">
                {SITE.email}
              </a>
              .
            </p>
          </div>
        )}

        <div className="space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-navy-950 sm:text-2xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-navy-950/75">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-line pt-8 text-[0.9375rem] text-muted">
          Questions about this page? Write to{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-gold-dark underline-offset-4 hover:underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
