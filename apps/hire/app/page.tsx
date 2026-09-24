import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PrototypeIllustration } from "@/components/visuals/prototype-illustration";
import { WorkSection } from "@/components/sections/work-section";
import { ServicesSection } from "@/components/sections/services-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FitSection } from "@/components/sections/fit-section";
import { AboutSection } from "@/components/sections/about-section";
import { InquirySection } from "@/components/sections/inquiry-section";
import { ContactOptions } from "@/components/sections/contact-options";
import { site } from "@/content/site";
import { getBookingDestination } from "@/lib/booking";
import { HeroHeadline } from "@/components/sections/hero-headline";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const booking = getBookingDestination();
  return <main className="home-page" id="main-content">
    <SiteShell className="hero v2-hero">
      <div>
        <p className="eyebrow">For founders who want to ship</p>
        <HeroHeadline />
        <p className="hero-copy">{site.hero.support}</p>
        <div className="hero-actions"><a className="button" href="#inquiry">Talk to Animesh</a><Link className="text-link" href="#work">Show, don’t tell</Link></div>
      </div>
      <PrototypeIllustration />
    </SiteShell>
    <WorkSection home />
    <div className="v2-services-page"><ServicesSection home /></div>
    <PricingSection home />
    <FitSection bookingHref={booking.href} bookingConfigured={booking.configured} bookingEmbedHref={booking.embedHref} />
    <AboutSection home />
    <InquirySection home />
    <ContactOptions />
  </main>;
}
