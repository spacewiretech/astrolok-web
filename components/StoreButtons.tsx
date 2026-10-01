import { PLAY_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="#00D7FE" d="M3.6 1.8c-.3.3-.5.8-.5 1.4v17.6c0 .6.2 1.1.5 1.4l.1.1 9.9-9.9v-.2L3.7 1.7z" />
      <path fill="#FFCE00" d="m16.9 15.7-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2z" />
      <path fill="#FF3A44" d="m17 15.6-3.4-3.4L3.6 22.2c.4.4 1 .4 1.7.1l11.7-6.7" />
      <path fill="#00F076" d="M17 8.8 5.3 2.1c-.7-.4-1.3-.3-1.7.1l10 10z" />
    </svg>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M16.37 12.64c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-2.99-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.39-.92-2.4-3.66ZM14.1 5.9c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.66 1.37-.58.67-1.1 1.76-.96 2.8 1.01.08 2.05-.52 2.68-1.27Z" />
    </svg>
  );
}

/** "light" = for light backgrounds, "dark" = for dark backgrounds */
type Tone = "light" | "dark";

export function GooglePlayButton({
  tone = "light",
  label,
  className,
}: {
  tone?: Tone;
  /** Replaces the "Get it on Google Play" badge text (same button, same link), e.g. "Start for ₹3". */
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-14 items-center gap-3 rounded-xl px-5 whitespace-nowrap transition-colors",
        tone === "light" ? "bg-navy-950 text-white hover:bg-navy-800" : "bg-white text-navy-950 hover:bg-cream",
        className,
      )}
    >
      <PlayGlyph className="size-6 shrink-0" />
      {label ? (
        <span className="font-display text-[1.0625rem] font-semibold">{label}</span>
      ) : (
        <span className="flex flex-col items-start leading-none">
          <span className="text-[0.625rem] font-medium tracking-[0.08em] uppercase opacity-70">Get it on</span>
          <span className="mt-1 font-display text-[1.0625rem] font-semibold">Google Play</span>
        </span>
      )}
      <span className="sr-only">{label ? "(opens Google Play in a new tab)" : "(opens in a new tab)"}</span>
    </a>
  );
}

export function AppStoreComingSoon({ tone = "light", className }: { tone?: Tone; className?: string }) {
  return (
    <span
      role="note"
      aria-label="App Store, coming soon"
      className={cn(
        "inline-flex h-14 cursor-default items-center gap-3 rounded-xl border px-5 whitespace-nowrap select-none",
        tone === "light" ? "border-navy-950/15 text-navy-950/55" : "border-white/20 text-white/55",
        className,
      )}
    >
      <AppleGlyph className="size-5 shrink-0" />
      <span className="flex flex-col items-start leading-none" aria-hidden>
        <span className="font-display text-[1.0625rem] font-semibold">App Store</span>
        <span className="mt-1 text-[0.6875rem]">Coming soon</span>
      </span>
    </span>
  );
}

export default function StoreButtons({ tone = "light", className }: { tone?: Tone; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <GooglePlayButton tone={tone} />
      <AppStoreComingSoon tone={tone} />
    </div>
  );
}
