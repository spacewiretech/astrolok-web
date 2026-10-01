import Link from "next/link";
import { cn } from "@/lib/utils";

export function OmMark({ className, tone = "navy" }: { className?: string; tone?: "navy" | "gold" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full font-display text-[1.2rem] leading-none",
        tone === "gold" ? "bg-gold text-navy-950" : "bg-navy-950 text-gold",
        className,
      )}
    >
      <span className="translate-y-[1px]">ॐ</span>
    </span>
  );
}

export function Wordmark({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("font-display font-medium tracking-[-0.01em]", className)}>
      <span className={dark ? "text-white" : "text-navy-950"}>Astro</span>
      <span className="text-gold">lok</span>
    </span>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="AstroLok home" className={cn("inline-flex items-center gap-2.5", className)}>
      <OmMark />
      <Wordmark className="text-[1.3rem]" />
    </Link>
  );
}
