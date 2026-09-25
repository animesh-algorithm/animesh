import { PricingSection } from "@/components/sections/pricing-section";
import { FitSection } from "@/components/sections/fit-section";
export const metadata = { title: "Pricing", description: "Engagement models and fit guidance for working directly with Animesh.", alternates: { canonical: "/pricing" } };
export default function PricingPage() { return <main id="main-content"><PricingSection /><FitSection /></main>; }
