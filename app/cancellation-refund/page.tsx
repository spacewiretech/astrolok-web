import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const doc = LEGAL_DOCS["cancellation-refund"];

export const metadata: Metadata = pageMetadata({ title: doc.title, description: doc.description, path: "/cancellation-refund" });

export default function Page() {
  return <LegalPage doc={doc} />;
}
