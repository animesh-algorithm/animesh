import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { PrototypeIllustration } from "@/components/visuals/prototype-illustration";
import { WorkSection } from "@/components/sections/work-section";
import { ServicesSection } from "@/components/sections/services-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FitSection } from "@/components/sections/fit-section";
import { AboutSection } from "@/components/sections/about-section";
import { InquirySection } from "@/components/sections/inquiry-section";
import { CalBooking } from "@/components/booking/cal-booking";
import { getBookingDestination } from "@/lib/booking";
import { site } from "@/content/site";
import { HeroHeadline } from "@/components/sections/hero-headline";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, url: "/", title: `${site.name} — Product studio for useful software`, description: "Animesh Sharma works with founders to turn product ideas and messy workflows into shipped software. Explore his work, services, pricing, and ways to start a project." },
  twitter: { card: "summary_large_image", title: `${site.name} — Product studio for useful software`, description: "Animesh Sharma works with founders to turn product ideas and messy workflows into shipped software. Explore his work, services, pricing, and ways to start a project.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Hire Animesh — From messy to shipped." }] },
};

export default function HomePage() {
  const booking = getBookingDestination();
  return <main className="home-page" id="main-content">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://hire.animesh.cc/#website",
      name: site.name,
      url: "https://hire.animesh.cc/",
    }).replace(/</g, "\\u003c") }} />
    <SiteShell className="hero v2-hero">
      <div>
        <p className="eyebrow">For founders who want to ship</p>
        <HeroHeadline />
        <p className="hero-copy">{site.hero.support}</p>
        <div className="hero-actions"><Link className="button" href="#book">Talk to Animesh</Link><Link className="text-link" href="#work">Show, don’t tell</Link></div>
      </div>
      <PrototypeIllustration />
    </SiteShell>
    <WorkSection home />
    <div className="v2-services-page"><ServicesSection home /></div>
    <PricingSection home />
    <FitSection />
    <AboutSection home />
    <section className="contact-booking" id="book" aria-label="Book a call">
      <div className="site-shell">
        {booking.embedHref ? <CalBooking embedHref={booking.embedHref} inquiryHref="#inquiry" /> : (
          <div className="contact-booking__fallback" data-reveal>
            <p className="section-kicker">Start with a conversation</p>
            <h2>Let’s talk through your project.</h2>
            <p>Send me a few times that work for you and the rough version of what you’re building. I’ll help you find a useful place to start.</p>
            <a className="button" href={booking.href}>Request a call by email</a>
            <a className="contact-booking__message" href="#inquiry">Prefer to write? Send a brief</a>
          </div>
        )}
      </div>
    </section>
    <InquirySection />
  </main>;
}
