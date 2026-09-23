import { PricingSection } from "@/components/sections/pricing-section";
import { FitSection } from "@/components/sections/fit-section";
import { getBookingDestination } from "@/lib/booking";
export const metadata = { title: "Pricing", description: "Engagement models and fit guidance for working directly with Animesh.", alternates: { canonical: "/pricing" } };
export default function PricingPage() { const booking = getBookingDestination(); return <main id="main-content"><PricingSection /><FitSection bookingHref={booking.href} bookingConfigured={booking.configured} bookingEmbedHref={booking.embedHref} /></main>; }
