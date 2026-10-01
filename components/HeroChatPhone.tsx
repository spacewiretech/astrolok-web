"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The Chat with Astro phone in the hero: a short looping clip on a transparent background.
 *
 * Transparent video needs a different file per engine: WebKit (Safari, and every browser
 * on iOS) only renders alpha from HEVC, while Blink/Gecko only render it from VP9 WebM.
 * Each engine reports it can *play* the other format but draws its background black, so
 * the source is chosen here rather than with <source> fallbacks. Until playback starts,
 * and always with reduced motion, the poster (the finished conversation) is shown.
 */
const SOURCES = {
  hevc: "/videos/hero-chat.mov",
  webm: "/videos/hero-chat.webm",
};

function usesWebKitAlpha() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const isDesktopSafari = ua.includes("Safari") && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);
  return isIOS || isDesktopSafari;
}

export default function HeroChatPhone({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let visible = true;
    const sync = () => {
      if (reduceMotion.matches || !visible) {
        video.pause();
        return;
      }
      if (!video.src) {
        video.src = usesWebKitAlpha() ? SOURCES.hevc : SOURCES.webm;
      }
      // Autoplay can still be refused (e.g. Low Power Mode); the poster stays in that case.
      video.play().catch(() => {});
    };

    // Pause while the hero is scrolled away.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    reduceMotion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      poster="/images/hero-chat-poster.webp"
      muted
      loop
      playsInline
      preload="none"
      aria-label="AstroLok Chat with Astro conversation on a phone"
      className={cn("block size-full object-contain", className)}
    />
  );
}
