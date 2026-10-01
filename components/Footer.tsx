import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { DISCLAIMER, FOOTER_LINKS, FOOTER_TAGLINE, SITE } from "@/lib/constants";

/* Column labels are plain text, not headings: they group links rather than start page sections. */
function Column({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `footer-${title.toLowerCase()}`;
  return (
    <nav aria-labelledby={id}>
      <p id={id} className="font-display text-[0.9375rem] font-semibold text-white">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </nav>
  );
}

const linkClass = "text-[0.9375rem] text-white/60 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 text-white">
      <div className="container-page pt-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="AstroLok home">
              <Wordmark dark className="text-[1.6rem] font-semibold" />
            </Link>
            <p className="mt-3 max-w-xs leading-relaxed text-white/60">{FOOTER_TAGLINE}</p>
          </div>

          <Column title="Company">
            {FOOTER_LINKS.company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Policies">
            {FOOTER_LINKS.policies.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Support">
            <li>
              <a href={`mailto:${SITE.email}`} className={linkClass}>
                {SITE.email}
              </a>
            </li>
          </Column>
        </div>

        <div className="mt-12 space-y-1.5 border-t border-white/10 pt-7 text-sm text-white/50">
          <p>
            © {SITE.year} {SITE.company}. All rights reserved.
          </p>
          <p>{DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
