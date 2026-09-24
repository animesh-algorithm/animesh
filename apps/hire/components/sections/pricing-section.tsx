import { engagements } from "@/content/commercial";

const formatPrice = (price: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

function ScopeIcon({ covered }: { covered: boolean }) {
  return covered ? (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="m4.5 10.3 3.2 3.2 7.8-8" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="m5.5 5.5 9 9m0-9-9 9" />
    </svg>
  );
}

export function PricingSection() {
  return (
    <section className="pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div className="site-shell pricing-header" data-reveal>
        <div>
          <p className="section-kicker">Simple pricing</p>
          <h1 id="pricing-title">Ways to work together.<br /><em>Scope comes first.</em></h1>
        </div>
        <p>Choose an engagement shape. I define scope and quote the work after understanding the problem.</p>
      </div>
      <div className="site-shell pricing-grid">
        {engagements.map((engagement, index) => (
          <article className={engagement.featured ? "pricing-card pricing-card--featured" : "pricing-card"} key={engagement.slug} data-reveal>
            <div className="pricing-card__topline"><span>0{index + 1}</span><span>{engagement.featured ? "Core engagement" : "Starting point"}</span></div>
            <h2>{engagement.name}</h2>
            {!engagement.provisional ? <p className="price"><span>from</span>{formatPrice(engagement.startingPriceUsd)}<small>{engagement.priceSuffix}</small></p> : <p className="pricing-intent">Price quoted after scope</p>}
            <p className="pricing-intent">{engagement.intent}</p>
            <p className="pricing-card__fit">A good fit for: {engagement.fit.join(" · ")}</p>
            <div className="pricing-scope">
              <div>
                <p className="pricing-card__list-label">What’s covered</p>
                <ul className="pricing-scope-list pricing-scope-list--covered">
                  {engagement.included.map((item) => <li key={item}><ScopeIcon covered /><span>{item}</span></li>)}
                </ul>
              </div>
              <div>
                <p className="pricing-card__list-label">What’s not covered</p>
                <ul className="pricing-scope-list pricing-scope-list--excluded">
                  {engagement.notIncluded.map((item) => <li key={item}><ScopeIcon covered={false} /><span>{item}</span></li>)}
                </ul>
              </div>
            </div>
            <a className={engagement.featured ? "button button--light" : "button button--ink"} href="/contact" aria-label={`Ask about ${engagement.name}`}>Ask about this</a>
          </article>
        ))}
      </div>
      <div className="site-shell pricing-principles" aria-label="What stays consistent" data-reveal>
        <div><span>01</span><strong>Direct access</strong><p>You work with the person shaping and building it.</p></div>
        <div><span>02</span><strong>Scope before build</strong><p>The problem, boundary, and price are made explicit first.</p></div>
        <div><span>03</span><strong>One working loop</strong><p>Product, engineering, and operations stay connected.</p></div>
        <div><span>04</span><strong>Honest handoff</strong><p>Known outcomes, constraints, and open questions remain visible.</p></div>
      </div>
      <p className="site-shell provisional-note">These engagement starting prices are under review. A scoped MVP build starts at $2,000 USD; ask for a quote based on your project.</p>
    </section>
  );
}
