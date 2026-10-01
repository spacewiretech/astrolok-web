"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { FramePriority, FrameSequence, whenIdle } from "@/lib/frame-loader";
import { clamp, cn } from "@/lib/utils";

export type ScrollFrameCanvasProps = {
  /** Path prefix, e.g. "/frames/palm/frame_" → /frames/palm/frame_001.png */
  framePath: string;
  frameCount: number;
  frameExt?: string;
  /** Lower-resolution sequence used on small screens (same naming). */
  smallFramePath?: string;
  /** Used per frame if the primary file fails to load (e.g. original PNGs). */
  fallbackFramePath?: string;
  fallbackFrameExt?: string;
  objectFit?: "cover" | "contain";
  /**
   * "near"  – load the full sequence once the section is within ~1 viewport (default)
   * "eager" – load the full sequence as soon as the component mounts
   */
  preload?: "near" | "eager";
  /** Load the first frame immediately instead of when the browser is idle. */
  priority?: boolean;
  /**
   * Tall element whose scroll position drives the animation (the reading section).
   * Progress runs 0 → 1 while its sticky child is pinned. Without it, progress
   * follows this element moving through the viewport.
   */
  trackRef?: RefObject<HTMLElement | null>;
  /** CSS custom property holding the sticky top offset (the header height). */
  stickyOffsetVar?: string;
  /** Frame shown when the user prefers reduced motion. Defaults to the last frame. */
  staticFrame?: number;
  /** Accessible description of the visual. */
  label: string;
  /** Receives scroll progress (0–1) at most once per animation frame. */
  onProgress?: (progress: number) => void;
  background?: string;
  /**
   * Only run (and download frames) while this media query matches — lets a
   * layout render separate desktop / mobile canvases without double loading.
   */
  media?: string;
  className?: string;
};

const SMALL_SCREEN = 768;
const MAX_DPR = 2;

export default function ScrollFrameCanvas({
  framePath,
  frameCount,
  frameExt = "png",
  smallFramePath,
  fallbackFramePath,
  fallbackFrameExt,
  objectFit = "cover",
  preload = "near",
  priority = false,
  trackRef,
  stickyOffsetVar = "--header-h",
  staticFrame,
  label,
  onProgress,
  background = "#05060d",
  media,
  className,
}: ScrollFrameCanvasProps) {
  const enabled = useMediaQuery(media);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!enabled || !wrap || !canvas || !ctx) return;

    const track = trackRef?.current ?? null;
    const lastIndex = frameCount - 1;
    const restIndex = clamp(staticFrame ?? lastIndex, 0, lastIndex);
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const useSmall = !!smallFramePath && window.innerWidth < SMALL_SCREEN;

    let reduced = reduceQuery.matches;
    let raf = 0;
    let drawn = -1;
    let sizeDirty = true;
    let near = false;
    let lastProgress = -1;
    let stickyOffset = 0;

    const setState = (state: "loading" | "ready" | "error") => {
      if (wrap.dataset.state !== state) wrap.dataset.state = state;
    };

    const seq = new FrameSequence({
      basePath: useSmall ? smallFramePath! : framePath,
      ext: frameExt,
      count: frameCount,
      fallbackBasePath: fallbackFramePath,
      fallbackExt: fallbackFrameExt,
      onFrameLoaded: (index) => {
        if (!seq.isLoaded(index) && seq.loadedCount === 0 && drawn < 0) setState("error");
        schedule();
      },
    });

    const readStickyOffset = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(stickyOffsetVar);
      stickyOffset = parseFloat(raw) || 0;
    };

    const computeProgress = () => {
      const vh = window.innerHeight;
      if (track) {
        const rect = track.getBoundingClientRect();
        // The sticky stage is pinned from rect.top === offset until rect.bottom === vh.
        const distance = rect.height - vh + stickyOffset;
        return distance > 0 ? clamp((stickyOffset - rect.top) / distance, 0, 1) : 1;
      }
      const rect = wrap.getBoundingClientRect();
      return clamp((vh - rect.top) / (vh + rect.height), 0, 1);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        sizeDirty = true;
      }
      readStickyOffset();
      schedule();
    };

    const draw = (index: number) => {
      const img = seq.images[index];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = objectFit === "cover" ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const tick = () => {
      raf = 0;
      const progress = reduced ? 1 : computeProgress();
      if (progress !== lastProgress) {
        lastProgress = progress;
        onProgressRef.current?.(progress);
      }

      const target = reduced ? restIndex : Math.round(progress * lastIndex);
      if (near || reduced) seq.request(target);

      const index = seq.nearestLoaded(target);
      if (index >= 0 && (index !== drawn || sizeDirty)) {
        draw(index);
        drawn = index;
        sizeDirty = false;
        setState("ready");
      }
    };

    function schedule() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const startFullLoad = () => {
      if (!reduced) seq.preloadAll();
    };

    // First frame (or the static frame for reduced motion).
    const firstFrame = () => seq.request(reduced ? restIndex : 0, -1);
    const cancelIdle = priority ? (firstFrame(), () => {}) : whenIdle(firstFrame);
    if (preload === "eager") startFullLoad();

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) {
          if (seq.priority < FramePriority.Near) seq.setPriority(FramePriority.Near);
          firstFrame();
          startFullLoad();
          schedule();
        } else {
          seq.setPriority(FramePriority.Idle);
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    const activeObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) seq.setPriority(FramePriority.Active);
        else if (near) seq.setPriority(FramePriority.Near);
      },
      { rootMargin: "0px" },
    );
    nearObserver.observe(track ?? wrap);
    activeObserver.observe(track ?? wrap);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    const onScroll = () => {
      if (near && !reduced) schedule();
    };
    const onReduceChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      lastProgress = -1;
      if (near) startFullLoad();
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", readStickyOffset, { passive: true });
    reduceQuery.addEventListener("change", onReduceChange);
    resize();

    return () => {
      cancelIdle();
      if (raf) cancelAnimationFrame(raf);
      nearObserver.disconnect();
      activeObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", readStickyOffset);
      reduceQuery.removeEventListener("change", onReduceChange);
      seq.dispose();
    };
  }, [
    enabled,
    framePath,
    frameCount,
    frameExt,
    smallFramePath,
    fallbackFramePath,
    fallbackFrameExt,
    objectFit,
    preload,
    priority,
    trackRef,
    stickyOffsetVar,
    staticFrame,
    background,
  ]);

  return (
    <div
      ref={wrapRef}
      data-state="loading"
      className={cn("group relative h-full w-full overflow-hidden", className)}
      style={{ backgroundColor: background }}
    >
      <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 block h-full w-full">
        {label}
      </canvas>

      {/* Loading shimmer, hidden once the first frame is drawn */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-500 group-data-[state=error]:opacity-0 group-data-[state=ready]:opacity-0"
      >
        <div className="size-16 rounded-full border border-gold/30 border-t-gold/80 motion-safe:animate-spin" />
      </div>

      <p className="pointer-events-none absolute inset-0 hidden place-items-center p-6 text-center text-sm text-white/60 group-data-[state=error]:grid">
        This visualization couldn&apos;t be loaded.
      </p>
    </div>
  );
}

/** true when `query` matches (or no query given). Server render assumes a match. */
function useMediaQuery(query?: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!query) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => (query ? window.matchMedia(query).matches : true),
    () => true,
  );
}
