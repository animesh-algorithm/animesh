import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteShell } from "@/components/layout/site-shell";
import { AvailabilityPulse } from "@/components/availability/availability-pulse";
import { InquirySection } from "@/components/sections/inquiry-section";
import { FitSection } from "@/components/sections/fit-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WorkSection } from "@/components/sections/work-section";
import { BuilderWorkbench } from "@/components/visuals/builder-workbench";
import { SectionTransition } from "@/components/visuals/section-transition";
import { availability } from "@/content/commercial";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { getBookingDestination } from "@/lib/booking";

export default function HomePage() {
  const booking = getBookingDestination();
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <SiteShell className="hero">
          <div id="top" data-reveal>
            <p className="eyebrow">
              <AvailabilityPulse className="availability-ping--hero" />
              {availability.label} · {availability.slots} project slot · from {availability.nextStart}
            </p>
            <h1>{site.hero.heading}</h1>
            <p className="hero-copy">{site.hero.support}</p>
            <div className="hero-actions">
              <a className="button" href="#inquiry">
                Tell me what’s stuck
              </a>
              <a className="text-link" href="#work">
                See selected work
              </a>
            </div>
          </div>
          <BuilderWorkbench />
        </SiteShell>

        <section className="site-shell foundation-proof" aria-label="Selected capabilities" data-reveal>
          <div>
            <strong className="proof-number">{projects.length}</strong>
            <p className="proof-label">verified projects ready to unpack</p>
          </div>
          <div>
            <strong className="proof-number">{services.length}</strong>
            <p className="proof-label">ways I can take a problem to shipped</p>
          </div>
          <div>
            <strong className="proof-number">1</strong>
            <p className="proof-label">operator across product, engineering, and operations</p>
          </div>
        </section>
        <SectionTransition from="paper" to="lilac" variant="gentle" />
        <WorkSection />
        <SectionTransition from="lilac" to="ink" variant="drift" />
        <ServicesSection />
        <SectionTransition from="ink" to="warm" variant="swell" />
        <PricingSection />
        <SectionTransition from="warm" to="paper" variant="gentle" />
        <FitSection bookingHref={booking.href} bookingConfigured={booking.configured} bookingEmbedHref={booking.embedHref} />
        <SectionTransition from="paper" to="cobalt" variant="drift" />
        <InquirySection />
      </main>
      <SectionTransition from="cobalt" to="ink" variant="swell" />
      <SiteFooter />
    </>
  );
}
