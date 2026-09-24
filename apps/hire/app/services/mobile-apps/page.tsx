import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/sections/service-detail-page";

export const metadata: Metadata = {
  title: "Mobile Apps",
  description: "Scoped mobile applications for iOS and Android, with the workflows, backend, and release responsibilities defined together.",
  alternates: { canonical: "/services/mobile-apps" },
  openGraph: { title: "Mobile Apps — Hire Animesh", url: "/services/mobile-apps" },
};

export default function MobileAppsPage() {
  return <ServiceDetailPage slug="mobile-apps" />;
}
