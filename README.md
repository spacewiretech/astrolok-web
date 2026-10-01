# AstroLok website

Marketing site for AstroLok — palm, face and astrology readings. Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide icons. No animation or UI libraries: the scroll-driven 3D readings are frame sequences drawn onto a single `<canvas>`.

## Commands

```bash
npm install
npm run dev              # http://localhost:3000
npm run build
npm run start
npm run lint
npm run optimize:frames  # PNG → WebP for the frame sequences (see below)
```

## Configuration

| What | Where | Override |
| --- | --- | --- |
| Google Play link (every Android CTA) | `PLAY_STORE_URL` in `lib/constants.ts` | `NEXT_PUBLIC_PLAY_STORE_URL` |
| Canonical site URL (metadata, sitemap, robots) | `SITE.url` in `lib/constants.ts` | `NEXT_PUBLIC_SITE_URL` |
| Frame source (`optimized` WebP or `original` PNG) | `FRAME_SOURCE` in `lib/constants.ts` | `NEXT_PUBLIC_FRAME_SOURCE=original` |

Copy on the page (readings, steps, pricing, FAQ, footer links) is in `lib/constants.ts`. Legal page text is in `lib/legal.ts`.

The App Store badge is shown as "Coming soon" and has no link. Chat with Astro is a live feature inside the app and uses the same Google Play link.

## Frame sequences

```
public/frames/<palm|face|astrology|chat>/frame_001.png … frame_120.png            source PNGs (1280×720, never modified)
public/frames-optimized/<palm|face|astrology|chat>/frame_001.webp …               generated WebP, served by default
public/frames-optimized/<palm|face|astrology|chat>/sm/frame_001.webp …            generated 720px WebP (optional small set)
```

Each sequence is 120 frames, interpolated from the 4-second, 24 fps source videos in `videos/` with FFmpeg `minterpolate` (30 fps). WebP cuts them from about 530 MB of PNG to about 41 MB at full size. If a WebP frame is missing, the player falls back to that frame's PNG automatically.

### Replacing a sequence

1. Put the new frames in `public/frames/<name>/` as `frame_001.png` … `frame_120.png`. If the count changes, update `FRAME_COUNT` in `lib/constants.ts`.
2. Run `npm run optimize:frames -- --force`.
3. To add a new sequence, add its folder, add the name to `FrameSequenceName`, and add an entry to `READING_FEATURES`.

`scripts/optimize-frames.mjs` uses `sharp` (installed with Next.js) and falls back to the `cwebp` CLI. If neither is available it exits without changing anything. Options: `--quality 80`, `--small-width 720`, `--force`.

## How the scroll animation works

- `components/ScrollFrameCanvas.tsx` renders one canvas. Scroll progress through the section (0 → 1) selects frame `Math.round(progress × (frameCount − 1))`, which is drawn in a `requestAnimationFrame` callback with cover/contain fitting and devicePixelRatio (capped at 2). Scroll listeners are passive, and nothing sets React state while you scroll.
- `lib/frame-loader.ts` holds one shared download queue (6 at a time). The frame closest to the viewport loads first. Frames load coarse-to-fine (1, 60, 30, 15, 45 …), and until the exact frame arrives the nearest loaded one is drawn, so fast scrolling never shows a blank canvas.
- A sequence downloads only when its section is within about one viewport of the screen. The first frame waits for idle time (`requestIdleCallback`).
- `components/ReadingSection.tsx` pins a stage inside a tall section (`position: sticky`), so the pin releases when the section ends. The four experiences share this engine but use different desktop compositions (`layout` in `READING_FEATURES`): `split` (palm: visual right, ruled checklist of lines), `portrait` (face: full-bleed, copy bottom-left), `cosmic` (astrology: full-bleed chart, title above, areas below) and `conversation` (Chat with Astro: phone centred, copy left, the chat's steps as a timeline right). Phones use one stacked layout.
- The same progress value lights the stage labels (life line, heart line…). No percentage or progress bar is shown. Labels are evenly spaced unless `stageAt` is set; Chat uses it so "You ask", "Astro is typing", "Astro replies" and "Suggested follow-ups" light up on the frames where that actually happens. Nothing else on the page animates on scroll.
- Desktop and mobile each have their own canvas layout. The `media` prop keeps the hidden one dormant, so frames are never downloaded twice.
- If the first few frames of a sequence all fail to load, the loader stops and the stage shows a short notice; copy and CTA stay usable.
- With `prefers-reduced-motion`, the sections drop the scroll length and show the final frame as a still image. The copy and CTAs stay the same.

## Structure

```
app/            page.tsx, layout.tsx (fonts, metadata), robots.ts, sitemap.ts, icon.svg,
                contact/, privacy/, terms/, cancellation-refund/, shipping-delivery/, delete-account/
components/     Header, MobileMenu, Hero, ReadingIntro, ReadingSection, ScrollFrameCanvas,
                PalmReading, FaceReading, AstrologyReading, ChatWithAstro, HowItWorks, TrustSection, Pricing, FAQ,
                ContactSection, FinalCTA, Footer, LegalPage, StoreButtons, Logo
lib/            constants.ts, frame-loader.ts, legal.ts, utils.ts
scripts/        optimize-frames.mjs
public/         frames/, frames-optimized/, images/hero-app-screens.png, og.jpg
```

## Content notes

- The hero app screens (`public/images/hero-app-screens.png`) were cropped from the existing site's screenshot. `og.jpg` is the last palm frame.
- Product copy (pandit's voice, PDF, the palm and face descriptions, "we would rather say so than pretend") comes from the existing site. No testimonials, ratings, user counts or other claims were added.
- The legal pages are structured placeholders marked "being finalised". Replace the bracketed text in `lib/legal.ts` and set `draft: false`. They make no claims about retention periods, legal entities, refunds or security measures.

## Welcome intro

`components/WelcomeIntro.tsx` shows an indigo entry screen with the Om mark. Tapping it (or pressing Enter) plays `public/audio/welcome.mp3` and fades into the site. Browsers only allow sound after a tap, which is why the intro waits for one. It appears once per browser session (`sessionStorage` key `astrolok:entered`); an inline script in `app/layout.tsx` hides it before first paint for returning visitors, and it never appears without JavaScript. To change the sound, replace `public/audio/welcome.mp3`.
