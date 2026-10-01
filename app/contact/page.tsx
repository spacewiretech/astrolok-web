import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import FAQ from "@/components/FAQ";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Questions about your AstroLok reading, plan or account? Write to the AstroLok team at contact@astrolok.app.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <FAQ showContact={false} />
    </>
  );
}
