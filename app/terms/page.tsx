import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const doc = LEGAL_DOCS["terms"];

export const metadata: Metadata = pageMetadata({ title: doc.title, description: doc.description, path: "/terms" });

export default function Page() {
  return <LegalPage doc={doc} />;
}
