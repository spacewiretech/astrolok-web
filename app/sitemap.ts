import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Every public, indexable route that exists in app/. Keep in sync when routes are added.
const ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/cancellation-refund", priority: 0.4, changeFrequency: "yearly" },
  { path: "/shipping-delivery", priority: 0.3, changeFrequency: "yearly" },
  { path: "/delete-account", priority: 0.3, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
