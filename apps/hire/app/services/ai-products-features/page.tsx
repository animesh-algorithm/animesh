import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/sections/service-detail-page";

export const metadata: Metadata = {
  title: "AI Products & Features",
  description: "Scoped AI product features and workflows grounded in a clear task, defined data boundaries, and reviewable results.",
  alternates: { canonical: "/services/ai-products-features" },
  openGraph: { title: "AI Products & Features — Hire Animesh", url: "/services/ai-products-features" },
};

export default function AiProductsFeaturesPage() {
  return <ServiceDetailPage slug="ai-products-features" />;
}
