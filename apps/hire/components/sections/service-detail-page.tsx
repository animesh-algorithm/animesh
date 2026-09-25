import Link from "next/link";

import { FaqAccordion } from "@/components/faq/faq-accordion";
import { servicePages, type DraftServiceSlug } from "@/content/service-pages";
import { getBookingDestination } from "@/lib/booking";

export function ServiceDetailPage({ slug }: { slug: DraftServiceSlug }) {
  const service = servicePages[slug];
  const booking = getBookingDestination();

  return <main id="main-content" className="mvp-page service-detail-page">
    <section className="mvp-hero" aria-labelledby="service-title"><div className="site-shell mvp-hero__layout">
      <div><Link className="mvp-back-link" href="/services">← All services</Link><p className="section-kicker">{service.name} / {service.number}</p><h1 id="service-title">{service.title}</h1><p className="mvp-hero__lead">{service.lead}</p><div className="hero-actions"><a className="button" href={booking.href}>{booking.configured ? "Book a call" : "Request a call"}</a><Link className="text-link" href="/contact">Send a brief →</Link></div></div>
      <aside className="mvp-offer" aria-label={`${service.name} at a glance`}><span>{service.offer}</span><strong>Quoted after scope</strong><p>We define the work and deliverables together before I give you a price.</p><div><span>01 / Define</span><span>02 / Build</span><span>03 / Handoff</span></div></aside>
    </div></section>
    <section className="mvp-fit" aria-labelledby="service-fit-title"><div className="site-shell mvp-split"><div><p className="section-kicker">Who this is for</p><h2 id="service-fit-title">{service.fitTitle}</h2></div><div className="mvp-fit__copy"><p>{service.fit}</p><Link className="text-link" href="/work">See the work →</Link></div></div></section>
    <section className="mvp-included" aria-labelledby="service-included-title"><div className="site-shell"><p className="section-kicker">The work</p><h2 id="service-included-title">{service.includedTitle}</h2><div className="mvp-included__grid"><p>{service.included}</p><div className="mvp-deliverables"><span>Defined in the scope</span><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div></div><p className="mvp-scope-note">{service.scopeNote}</p></div></section>
    <section className="mvp-process" aria-labelledby="service-process-title"><div className="site-shell"><p className="section-kicker">How we work</p><h2 id="service-process-title">From the problem to a working handoff.</h2><ol className="mvp-process__steps">{service.steps.map((step, index) => <li key={step.name}><span>0{index + 1}</span><div><h3>{step.name}</h3><p>{step.description}</p></div></li>)}</ol></div></section>
    <section className="mvp-faq" aria-labelledby="service-faq-title"><div className="site-shell mvp-split"><div><p className="section-kicker">Before we start</p><h2 id="service-faq-title">Good questions, clear answers.</h2></div><FaqAccordion items={service.faqs} /></div></section>
    <section className="mvp-close" aria-labelledby="service-close-title"><div className="site-shell"><p className="section-kicker">Start a conversation</p><h2 id="service-close-title">{service.closeTitle}</h2><p>{service.close}</p><div className="hero-actions"><a className="button button--light" href={booking.href}>{booking.configured ? "Book a call" : "Request a call"}</a><Link className="text-link" href="/contact">Send a brief →</Link></div></div></section>
  </main>;
}
