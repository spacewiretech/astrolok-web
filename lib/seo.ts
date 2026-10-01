/* ------------------------------------------------------------------
   SEO: page metadata and JSON-LD.
   Canonical host is SITE.url (https://astrolok.app). Paths are written
   without a trailing slash; the homepage canonical is "https://astrolok.app/".
   ------------------------------------------------------------------ */

import type { Metadata } from "next";
import { FAQ_ITEMS, PLAY_STORE_URL, PRICING, SITE } from "@/lib/constants";

export const SEO = {
  title: "AstroLok – Palm Reading, Face Reading & Astrology",
  description:
    "Explore Palm Reading, Face Reading, Kundli and Astrology with AstroLok. Get personalized insights about love, career, marriage and more. Try it for ₹3.",
  ogImage: { url: "/og.jpg", width: 1200, height: 630, alt: "AstroLok palm reading showing palm lines lit in gold" },
  androidPackage: "com.spacewire.astrolok",
} as const;

export const absoluteUrl = (path = "/") => (path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`);

/**
 * Metadata for a sub-page. Sets its own canonical, Open Graph and Twitter tags so shared
 * links preview the page itself rather than inheriting the homepage's og:url / og:title.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} · ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_IN",
      url,
      title: fullTitle,
      description,
      images: [SEO.ogImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [SEO.ogImage.url] },
  };
}

/* ------------------------------------------------------------------
   Structured data. Only facts that are true and visible on the site:
   no ratings, reviews or awards.
   ------------------------------------------------------------------ */

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const APP_ID = `${SITE.url}/#app`;

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.company,
        url: absoluteUrl("/"),
        email: SITE.email,
        brand: { "@type": "Brand", name: SITE.name },
        contactPoint: {
          "@type": "ContactPoint",
          email: SITE.email,
          contactType: "customer support",
          availableLanguage: ["en", "hi"],
        },
        sameAs: [PLAY_STORE_URL],
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        name: SITE.name,
        url: absoluteUrl("/"),
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "MobileApplication",
        "@id": APP_ID,
        name: SITE.name,
        description: SEO.description,
        operatingSystem: "Android",
        applicationCategory: "LifestyleApplication",
        url: absoluteUrl("/"),
        installUrl: PLAY_STORE_URL,
        downloadUrl: PLAY_STORE_URL,
        image: absoluteUrl(SEO.ogImage.url),
        featureList: ["Palm Reading", "Face Reading", "Astrology and Kundli", "Chat with Astro"],
        publisher: { "@id": ORG_ID },
        offers: {
          "@type": "Offer",
          price: PRICING.trialPrice.replace(/[^\d.]/g, ""),
          priceCurrency: "INR",
          description: `${PRICING.plan} for ${PRICING.trialPrice}, ${PRICING.renewal}. Cancel anytime before the trial ends.`,
          url: PLAY_STORE_URL,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped (per the Next.js JSON-LD guide). */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
