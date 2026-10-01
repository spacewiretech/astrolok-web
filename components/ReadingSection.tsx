"use client";

import { useCallback, useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import ScrollFrameCanvas from "@/components/ScrollFrameCanvas";
import { FRAME_COUNT, PLAY_STORE_URL, getFrameSources, type ReadingFeature } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Layout = ReadingFeature["layout"];

type ReadingSectionProps = {
  feature: ReadingFeature;
  /** Scroll length of the section; the animation spans (height − one viewport). */
  sectionHeight?: string;
};

/* Scroll length per composition: the astrology chart gets the longest, most immersive pin. */
const SECTION_HEIGHT: Record<Layout, string> = {
  split: "clamp(1700px, 260vh, 2800px)",
  portrait: "clamp(1600px, 240vh, 2600px)",
  cosmic: "clamp(1900px, 290vh, 3100px)",
  conversation: "clamp(1800px, 270vh, 2900px)",
};

/* Fades that melt the frame edges into the surrounding page colour. */
const FADE_Y = "linear-gradient(to bottom, transparent 0%, #000 10%, #000 88%, transparent 100%)";
const MASK: Record<Layout, CSSProperties> = {
  split: {
    maskImage: `linear-gradient(to left, #000 60%, transparent 100%), ${FADE_Y}`,
    WebkitMaskImage: `linear-gradient(to left, #000 60%, transparent 100%), ${FADE_Y}`,
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  },
  portrait: { maskImage: FADE_Y, WebkitMaskImage: FADE_Y },
  cosmic: { maskImage: FADE_Y, WebkitMaskImage: FADE_Y },
  // Spotlight on the phone: the room fades out on both sides, where the copy sits.
  conversation: {
    maskImage: `linear-gradient(to right, transparent 8%, #000 34%, #000 66%, transparent 92%), ${FADE_Y}`,
    WebkitMaskImage: `linear-gradient(to right, transparent 8%, #000 34%, #000 66%, transparent 92%), ${FADE_Y}`,
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  },
};
const MASK_MOBILE: CSSProperties = {
  maskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
};

/* Desktop composition classes. Below lg every reading uses the same stacked layout. */
const STYLES: Record<
  Layout,
  { visual: string; scrim?: string; outer: string; inner: string; lead: string; title?: string; detail: string; stages: string; item: string }
> = {
  split: {
    visual: "lg:right-0 lg:w-[64%]",
    outer: "lg:items-center lg:pb-0",
    inner: "",
    lead: "lg:max-w-[26rem]",
    detail: "lg:mt-8 lg:max-w-[16rem]",
    stages: "lg:flex-col lg:gap-0 lg:border-t lg:border-white/10",
    item: "lg:border-b lg:border-white/10 lg:py-2.5",
  },
  portrait: {
    visual: "lg:inset-x-0",
    scrim:
      "bg-[linear-gradient(to_top,rgba(3,5,15,0.95)_0%,rgba(3,5,15,0.4)_30%,transparent_55%),linear-gradient(to_right,rgba(3,5,15,0.75)_0%,transparent_38%)]",
    outer: "lg:items-end lg:pb-14",
    inner: "lg:flex lg:items-end lg:justify-between lg:gap-16",
    lead: "lg:max-w-[30rem]",
    detail: "lg:w-[15rem] lg:shrink-0",
    stages: "lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-2",
    item: "",
  },
  cosmic: {
    visual: "lg:inset-x-0",
    scrim:
      "bg-[linear-gradient(to_bottom,rgba(3,5,15,0.96)_0%,rgba(3,5,15,0.8)_26%,transparent_44%,transparent_62%,rgba(3,5,15,0.85)_80%,rgba(3,5,15,0.96)_100%)]",
    outer: "lg:items-stretch lg:pb-0",
    inner: "lg:flex lg:h-full lg:flex-col lg:items-center lg:justify-between lg:py-10 lg:text-center",
    lead: "lg:max-w-2xl lg:[&>p]:mx-auto lg:[&>p]:text-white/80 lg:[text-shadow:0_1px_16px_rgba(3,5,15,0.9)]",
    detail: "lg:flex lg:flex-col lg:items-center",
    stages: "lg:justify-center lg:gap-x-8",
    item: "",
  },
  conversation: {
    visual: "lg:inset-x-0",
    outer: "lg:items-center lg:pb-0",
    inner: "lg:flex lg:items-center lg:justify-between lg:gap-10",
    lead: "lg:max-w-[16rem] xl:max-w-[23rem]",
    // Between lg and xl there is little room beside the centred phone
    title: "lg:text-[2.25rem] xl:text-[2.5rem]",
    detail: "lg:mt-0 lg:w-[13rem] lg:shrink-0",
    // A vertical timeline of the chat, markers sitting on the line
    stages: "lg:flex-col lg:gap-4 lg:border-l lg:border-white/15 lg:pl-5",
    item: "lg:relative lg:[&>span]:absolute lg:[&>span]:left-[calc(-1.25rem-3.5px)]",
  },
};

/* Mobile canvas height: the chat phone is tall and narrow, so it gets a little more room. */
const MOBILE_VISUAL_HEIGHT: Record<Layout, string> = {
  split: "h-[56svh] sm:h-[62svh]",
  portrait: "h-[56svh] sm:h-[62svh]",
  cosmic: "h-[56svh] sm:h-[62svh]",
  conversation: "h-[60svh] short:h-[50svh] sm:h-[66svh]",
};

export default function ReadingSection({ feature, sectionHeight }: ReadingSectionProps) {
  const trackRef = useRef<HTMLElement>(null);
  const stagesRef = useRef<HTMLOListElement>(null);
  const { layout } = feature;
  const s = STYLES[layout];
  const titleId = `${feature.id}-title`;
  const { framePath, frameExt, fallback } = getFrameSources(feature.sequence);
  const stageAt = feature.stageAt;
  // Copy and CTA stay together on the left for these; the others end with the CTA.
  const ctaWithLead = layout === "portrait" || layout === "conversation";

  // Runs inside the canvas' animation frame and writes to the DOM directly, no React state.
  const handleProgress = useCallback((progress: number) => {
    const items = stagesRef.current?.children;
    if (!items) return;
    const n = items.length;
    for (let i = 0; i < n; i++) {
      const active = progress >= (stageAt?.[i] ?? (i + 1) / (n + 1));
      const el = items[i] as HTMLElement;
      if ((el.dataset.active === "true") !== active) el.dataset.active = String(active);
    }
  }, [stageAt]);

  const canvasProps = {
    framePath,
    frameExt,
    fallbackFramePath: fallback?.framePath,
    fallbackFrameExt: fallback?.frameExt,
    frameCount: FRAME_COUNT,
    objectFit: "cover" as const,
    trackRef,
    label: feature.canvasLabel,
    onProgress: handleProgress,
    background: "#03050f",
  };

  const cta = (className?: string) => (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group mt-6 inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-bright lg:mt-7",
        className,
      )}
    >
      {feature.cta}
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      <span className="sr-only">(opens Google Play in a new tab)</span>
    </a>
  );

  return (
    <section
      ref={trackRef}
      id={feature.id}
      aria-labelledby={titleId}
      className="relative h-(--track-h) motion-reduce:h-auto"
      style={{ "--track-h": sectionHeight ?? SECTION_HEIGHT[layout] } as CSSProperties}
    >
      <div className="sticky top-(--header-h) h-[calc(100svh-var(--header-h))] overflow-hidden motion-reduce:relative motion-reduce:top-0 motion-reduce:h-auto motion-reduce:min-h-[calc(100svh-var(--header-h))]">
        {/* Visual: desktop */}
        <div className={cn("absolute inset-y-0 hidden lg:block", s.visual)} style={MASK[layout]}>
          <ScrollFrameCanvas {...canvasProps} media="(min-width: 1024px)" />
        </div>
        {s.scrim && <div aria-hidden className={cn("pointer-events-none absolute inset-0 hidden lg:block", s.scrim)} />}

        {/* Visual: phones and tablets */}
        <div className={cn("absolute inset-x-0 top-0 lg:hidden", MOBILE_VISUAL_HEIGHT[layout])} style={MASK_MOBILE}>
          <ScrollFrameCanvas {...canvasProps} media="(max-width: 1023.98px)" />
        </div>
        {/* Phones: keep the copy readable where it overlaps the bottom of the visual */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-void via-void/80 to-transparent lg:hidden" />

        <div className={cn("relative flex h-full items-end pb-8 sm:pb-12", s.outer)}>
          <div className={cn("container-page", s.inner)}>
            <div className={s.lead}>
              {feature.label && (
                <p aria-hidden className="mb-3 text-xs font-medium tracking-[0.14em] text-gold uppercase max-lg:hidden">
                  {feature.label}
                </p>
              )}
              <h2
                id={titleId}
                className={cn(
                  "font-sans text-[2rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-white sm:text-[2.75rem]",
                  s.title ?? "lg:text-[3.25rem]",
                )}
              >
                {/* The reading's name for search engines and screen readers; the visible heading is the hook */}
                <span className="sr-only">{feature.name}: </span>
                {/* Keep each sentence together where it fits ("Sawaal hai? / Astro se poochiye."), no hard breaks */}
                {feature.title.split(/(?<=[?.])\s+/).map((sentence, i) => (
                  <span key={i}>
                    {i > 0 && " "}
                    <span className="inline-block">{sentence}</span>
                  </span>
                ))}
              </h2>
              <p className="sr-only">{feature.seoDescription}</p>
              <p className="mt-3 max-w-[26rem] text-base leading-relaxed font-normal text-white/70 lg:mt-4 lg:text-[1.0625rem]">
                {feature.body}
              </p>
              {ctaWithLead && cta("max-lg:hidden")}
            </div>

            <div className={cn("mt-5", s.detail)}>
              <p className="sr-only">{feature.stagesLabel}:</p>
              <ol
                ref={stagesRef}
                className={cn(
                  "flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8125rem] short:max-lg:hidden",
                  // On phones the chat screen itself shows each step, so the list would only repeat it.
                  layout === "conversation" && "max-lg:hidden",
                  s.stages,
                )}
              >
                {feature.stages.map((stage) => (
                  <li
                    key={stage}
                    data-active="false"
                    className={cn(
                      "group/item flex items-center gap-2 text-white/40 transition-colors duration-500 data-[active=true]:text-white/85 motion-reduce:text-white/85",
                      s.item,
                    )}
                  >
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-white/25 transition-colors duration-500 group-data-[active=true]/item:bg-gold motion-reduce:bg-gold"
                    />
                    {stage}
                  </li>
                ))}
              </ol>

              {feature.note && (
                <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-white/50 max-lg:hidden">{feature.note}</p>
              )}

              {cta(ctaWithLead ? "lg:hidden" : undefined)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
