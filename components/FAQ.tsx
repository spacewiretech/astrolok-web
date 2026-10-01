"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FAQ_ITEMS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* Phrases in the answers that point to a real page: turned into links, text unchanged. */
const ANSWER_LINKS: { phrase: string; href: string }[] = [
  { phrase: "Privacy Policy", href: "/privacy" },
  { phrase: "Cancellation & Refund policy", href: "/cancellation-refund" },
  { phrase: SITE.email, href: `mailto:${SITE.email}` },
];
const LINK_PATTERN = new RegExp(`(${ANSWER_LINKS.map((l) => l.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
const linkClass = "text-navy-950 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold-dark";

function withLinks(text: string): ReactNode {
  return text.split(LINK_PATTERN).map((part, i) => {
    const link = ANSWER_LINKS.find((l) => l.phrase === part);
    if (!link) return part;
    return link.href.startsWith("mailto:") ? (
      <a key={i} href={link.href} className={linkClass}>
        {part}
      </a>
    ) : (
      <Link key={i} href={link.href} className={linkClass}>
        {part}
      </Link>
    );
  });
}

type FAQProps = {
  showContact?: boolean;
  /** Render as a column inside <PricingFAQ> instead of a standalone section. */
  embedded?: boolean;
  className?: string;
};

export default function FAQ({ showContact = true, embedded = false, className }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={cn(!embedded && "bg-cream py-20 sm:py-24", className)}
    >
      <div className={cn(!embedded && "container-narrow")}>
        <h2 id="faq-title" className={cn("heading-section text-navy-950", embedded && "lg:text-[2.75rem]")}>
          Got questions? We have answers.
        </h2>

        <div className={cn("border-t border-navy-950/15", embedded ? "mt-7" : "mt-10")}>
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div key={item.q} className="border-b border-navy-950/15">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-6 text-left font-display font-medium text-navy-950 transition-colors hover:text-gold-dark",
                      embedded ? "py-3.5 text-base" : "py-5 text-[1.0625rem]",
                    )}
                  >
                    {item.q}
                    <Plus
                      aria-hidden
                      className={cn(
                        "size-5 shrink-0 text-gold-dark transition-transform duration-300",
                        open && "rotate-45",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!open}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className={cn("max-w-[40rem] leading-relaxed text-navy-950/70", embedded ? "pb-4 text-[0.9375rem]" : "pb-6")}>
                      {withLinks(item.a)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showContact && (
          <p id="contact" className={cn("text-navy-950/70", embedded ? "mt-6" : "mt-10")}>
            Still stuck?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-navy-950 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold-dark"
            >
              Write to us at {SITE.email}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
