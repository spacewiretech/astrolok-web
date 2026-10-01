import type { MetadataRoute } from "next";
import { PLAY_STORE_URL, SITE } from "@/lib/constants";
import { SEO } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} – Palm Reading, Face Reading & Astrology`,
    short_name: SITE.name,
    description: SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff8ec",
    theme_color: "#fff8ec",
    lang: "en-IN",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
    related_applications: [{ platform: "play", id: SEO.androidPackage, url: PLAY_STORE_URL }],
  };
}
