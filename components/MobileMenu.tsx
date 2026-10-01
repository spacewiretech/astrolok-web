"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, PLAY_STORE_URL, TRIAL_LINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Disclosure-style menu: the button toggles a sheet directly under the header. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-1 lg:hidden">
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-bright"
      >
        Get App
        <span className="sr-only"> (opens Google Play in a new tab)</span>
      </a>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-full text-navy-950 transition-colors hover:bg-cream"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      {/* The header has no filters or transforms, so this fixed sheet is positioned against the viewport. */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        inert={!open}
        className={cn(
          "fixed inset-x-0 top-(--header-h) bottom-0 flex flex-col overflow-y-auto border-t border-line/70 bg-white transition-[opacity,transform,visibility] duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <ul className="container-page divide-y divide-line/70">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-xl font-medium text-navy-950 transition-colors hover:text-gold-dark"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="container-page mt-auto pt-8 pb-10">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full bg-navy-950 px-6 py-3.5 text-center font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Get it on Google Play
          </a>
          <p className="mt-4 text-center text-sm text-muted">App Store coming soon</p>
          <p className="mt-1 text-center text-sm text-muted">{TRIAL_LINE}</p>
        </div>
      </nav>
    </div>
  );
}
