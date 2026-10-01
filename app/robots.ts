import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

// Everything public is crawlable; there are no account, admin or API routes to hide.
// CSS, JS, images and frame assets are left unblocked so pages render fully for crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
