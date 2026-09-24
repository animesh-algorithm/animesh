import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/sections/service-detail-page";

export const metadata: Metadata = {
  title: "SaaS & Web Apps",
  description: "Scoped web applications, SaaS platforms, portals, dashboards, and connected workflows built around the people who use them.",
  alternates: { canonical: "/services/saas-web-apps" },
  openGraph: { title: "SaaS & Web Apps — Hire Animesh", url: "/services/saas-web-apps" },
};

export default function SaasWebAppsPage() {
  return <ServiceDetailPage slug="saas-web-apps" />;
}
