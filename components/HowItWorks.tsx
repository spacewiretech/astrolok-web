import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

/** A single horizontal process: one line, three stops. Vertical on phones. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="bg-cream py-14 sm:py-16">
      <div className="container-page">
        <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end lg:gap-12">
          <h2 id="how-title" className="heading-section text-navy-950 lg:text-[2.75rem]">
            <span className="sr-only">How AstroLok works: </span>
            Apni reading 3 simple steps mein paaiye.
          </h2>
          <p className="leading-relaxed text-muted lg:pb-1">No long forms. No complicated questionnaires. Bas 3 simple steps.</p>
        </div>

        <ol className="relative mt-8 grid gap-8 md:grid-cols-3 md:gap-10 lg:mt-10">
          {/* Phones: one vertical line through the numbers */}
          <span aria-hidden className="absolute top-5 bottom-5 left-5 w-px bg-gold/40 md:hidden" />
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <li
              key={step.number}
              className="relative pl-16 md:pl-0 md:[&:not(:last-child)]:after:absolute md:[&:not(:last-child)]:after:top-5 md:[&:not(:last-child)]:after:right-[-1.25rem] md:[&:not(:last-child)]:after:left-14 md:[&:not(:last-child)]:after:h-px md:[&:not(:last-child)]:after:bg-gold/40 md:[&:not(:last-child)]:after:content-['']"
            >
              <span className="absolute top-0 left-0 grid size-10 place-items-center rounded-full bg-gold font-display text-[0.9375rem] font-semibold text-navy-950 ring-8 ring-cream md:static">
                {i + 1}
              </span>
              <h3 className="font-display text-lg font-semibold text-navy-950 md:mt-5">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-navy-950/65">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
