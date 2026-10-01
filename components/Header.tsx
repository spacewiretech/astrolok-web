import Link from "next/link";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import { NAV_ITEMS, PLAY_STORE_URL } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 h-(--header-h) border-b border-line/70 bg-white">
      <div className="container-page flex h-full items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.9375rem] font-medium text-navy-950/80 underline-offset-8 transition-colors hover:text-navy-950 hover:underline hover:decoration-gold hover:decoration-2"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-6 py-3 text-[0.9375rem] font-semibold text-navy-950 transition-colors hover:bg-gold-bright"
          >
            Get the app
            <span className="sr-only"> (opens Google Play in a new tab)</span>
          </a>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
