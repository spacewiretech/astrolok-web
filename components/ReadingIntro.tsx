import Link from "next/link";
import { READING_FEATURES } from "@/lib/constants";

/**
 * Opens the dark readings band: a short, left-aligned lead-in, then a plain index of the
 * four experiences so each one (Chat included) can be reached directly.
 */
export default function ReadingIntro() {
  return (
    <div className="container-page pt-24 pb-10 text-white sm:pt-28 lg:pb-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-16">
        <h2 id="readings-title" className="heading-section max-w-[22ch]">
          Khud ke baare mein aur jaanne ke 4 ways.
        </h2>
        <p className="max-w-md leading-relaxed text-white/60 lg:pb-2">
          Apni palm, face, birth chart dekhiye ya Astro se directly apna sawaal poochiye.
        </p>
      </div>

      <ol className="mt-12 grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
        {READING_FEATURES.map((feature, i) => (
          <li key={feature.id} className="border-b border-white/10 lg:border-b-0">
            <Link
              href={`#${feature.id}`}
              className="flex items-baseline gap-3 py-4 pr-4 text-white/70 transition-colors hover:text-white"
            >
              <span className="text-xs text-gold tabular-nums">0{i + 1}</span>
              <span>
                <span className="block font-display font-medium">{feature.name}</span>
                <span className="mt-1 block text-sm text-white/50">{feature.teaser}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
