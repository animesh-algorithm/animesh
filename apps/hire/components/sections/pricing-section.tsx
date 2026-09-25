import { engagements } from "@/content/commercial";
import { getBookingDestination } from "@/lib/booking";
import { PricingBookingAction } from "@/components/booking/pricing-booking-action";

const formatPrice = (price: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20"><path d="m3 10 4.5 4.5L17 5" /></svg>;
}

export function PricingSection({ home = false }: { home?: boolean }) {
  const booking = getBookingDestination();
  return (
    <section className="pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div className="site-shell pricing-header" data-reveal>
        <div>
          <p className="section-kicker">Simple pricing</p>
          {home ? <h2 id="pricing-title">Ways to work together.<br /><em>Scope comes first.</em></h2> : <h1 id="pricing-title">Ways to work together.<br /><em>Scope comes first.</em></h1>}
        </div>
        <p>Three ways to ship. Project work is scoped and quoted; the monthly retainer has a fixed rate.</p>
      </div>
      <div className="site-shell pricing-grid">
        {engagements.map((engagement) => (
          <article className={engagement.featured ? "pricing-card pricing-card--featured" : "pricing-card"} key={engagement.slug} data-reveal>
            {home ? <h3>{engagement.name}</h3> : <h2>{engagement.name}</h2>}
            <p className="price">{formatPrice(engagement.startingPriceUsd)}{engagement.slug === "retainer" ? "" : "+"}<small>{"priceSuffix" in engagement ? engagement.priceSuffix : ""}</small></p>
            <p className="pricing-promise">{engagement.promise}</p>
            <p className="pricing-audience">{engagement.audience}</p>
            <ul className="pricing-scope-list">
              {engagement.included.map((item) => <li key={item}><CheckIcon /><span>{item}</span></li>)}
            </ul>
            <PricingBookingAction label={engagement.cta} engagement={engagement.name} featured={engagement.featured} embedHref={booking.embedHref} fallbackHref={booking.href} inquiryHref={home ? "#inquiry" : "/contact#inquiry"} />
          </article>
        ))}
      </div>
    </section>
  );
}
