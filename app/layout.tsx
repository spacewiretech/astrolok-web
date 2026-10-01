import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeIntro from "@/components/WelcomeIntro";
import { INTRO_SESSION_KEY, PLAY_STORE_URL, SITE } from "@/lib/constants";
import { SEO, absoluteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Devanagari subset carries the ॐ used in the logo mark.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "devanagari"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Homepage metadata; sub-pages override canonical/OG/Twitter via pageMetadata() in lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SEO.title,
    template: `%s · ${SITE.name}`,
  },
  description: SEO.description,
  applicationName: SITE.name,
  creator: SITE.company,
  publisher: SITE.company,
  category: "lifestyle",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SEO.title,
    description: SEO.description,
    url: absoluteUrl("/"),
    locale: "en_IN",
    images: [SEO.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [SEO.ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  appLinks: {
    android: { package: SEO.androidPackage, app_name: SITE.name, url: PLAY_STORE_URL },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fff8ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script below adds an intro class to <html> before React hydrates.
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: skip the welcome intro if this session already entered, otherwise lock scrolling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.add(sessionStorage.getItem(${JSON.stringify(INTRO_SESSION_KEY)})?"intro-done":"intro-lock")}catch(e){document.documentElement.classList.add("intro-done")}`,
          }}
        />
        <noscript>
          <style>{`#welcome-intro{display:none}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-svh flex-col">
        <WelcomeIntro />
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-navy-950 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
