"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_SESSION_KEY } from "@/lib/constants";

/**
 * Entry screen: the Om mark on indigo with "Tap to enter". The tap is the user gesture
 * browsers require before playing sound, so the welcome audio starts on it while the
 * screen fades away to reveal the site.
 *
 * Shown once per browser session. An inline script in app/layout.tsx sets
 * `intro-done` (hide) or `intro-lock` (no page scroll) on <html> before first paint,
 * so returning visitors never see it flash and visitors without JS never see it at all.
 */
type Phase = "waiting" | "leaving" | "gone";

export default function WelcomeIntro() {
  const [phase, setPhase] = useState<Phase>("waiting");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains("intro-done")) buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const enter = () => {
    if (phase !== "waiting") return;
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.85;
      audio.play().catch(() => {}); // Some browsers/settings still refuse; the transition runs regardless.
    }
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {}

    const root = document.documentElement;
    root.classList.remove("intro-lock"); // let the page scroll while the screen fades
    setPhase("leaving");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      root.classList.add("intro-done");
      setPhase("gone");
    }, reduced ? 500 : 2100);
  };

  return (
    <div
      id="welcome-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to AstroLok"
      data-phase={phase}
      className="group/intro fixed inset-0 z-[100] bg-[radial-gradient(ellipse_at_50%_45%,#26236b_0%,#141649_38%,#0b1235_68%,#060823_100%)] transition-opacity duration-[1400ms] ease-out data-[phase=gone]:hidden data-[phase=leaving]:pointer-events-none data-[phase=leaving]:opacity-0 data-[phase=leaving]:delay-[650ms] motion-reduce:duration-500 motion-reduce:data-[phase=leaving]:delay-0"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={enter}
        aria-label="Enter AstroLok"
        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-white outline-none"
      >
        {/* Om mark */}
        <span aria-hidden className="relative grid size-36 place-items-center sm:size-44">
          {/* ripple released on enter */}
          <span className="absolute inset-0 rounded-full border border-gold/50 opacity-0 group-data-[phase=leaving]/intro:animate-[intro-ripple_1.6s_ease-out_forwards] motion-reduce:hidden" />
          <span className="absolute inset-0 rounded-full border border-gold/35 bg-[radial-gradient(circle,rgba(242,180,58,0.14),transparent_70%)] transition-[transform,box-shadow] duration-1000 ease-out group-data-[phase=leaving]/intro:scale-110 group-data-[phase=leaving]/intro:shadow-[0_0_80px_8px_rgba(242,180,58,0.35)] motion-reduce:transition-none motion-reduce:group-data-[phase=leaving]/intro:scale-100" />
          <span className="relative translate-y-[2px] animate-[intro-breathe_3.2s_ease-in-out_infinite] font-display text-[4.5rem] leading-none text-gold transition-[transform,filter] duration-1000 ease-out group-data-[phase=leaving]/intro:scale-115 group-data-[phase=leaving]/intro:[filter:drop-shadow(0_0_24px_rgba(242,180,58,0.75))] motion-reduce:animate-none motion-reduce:group-data-[phase=leaving]/intro:scale-100 sm:text-[5.5rem]">
            ॐ
          </span>
        </span>

        {/* Wordmark */}
        <span
          aria-hidden
          className="mt-8 font-display text-3xl font-medium tracking-[-0.01em] transition-opacity duration-500 group-data-[phase=leaving]/intro:opacity-0 sm:text-4xl"
        >
          Astro<span className="text-gold">lok</span>
        </span>

        <span
          aria-hidden
          className="mt-10 animate-[intro-hint_2.4s_ease-in-out_infinite] text-xs font-medium tracking-[0.3em] text-white/60 uppercase transition-opacity duration-300 group-data-[phase=leaving]/intro:animate-none group-data-[phase=leaving]/intro:opacity-0 motion-reduce:animate-none"
        >
          Tap to enter
        </span>
      </button>

      <audio ref={audioRef} src="/audio/welcome.mp3" preload="auto" />
    </div>
  );
}
