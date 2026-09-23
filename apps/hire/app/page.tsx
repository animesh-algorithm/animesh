import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PrototypeIllustration } from "@/components/visuals/prototype-illustration";
import { VisaFileProductImage } from "@/components/visuals/visafile-product-image";
import { GradlyProductImages } from "@/components/visuals/gradly-product-images";
import { GradlyImmigrationIllustration } from "@/components/visuals/gradly-immigration-illustration";
import { ClaimsAdjudicationVisual } from "@/components/visuals/claims-adjudication-visual";
import { InsuranceConciergeVisual } from "@/components/visuals/insurance-concierge-visual";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { engagements, faqs } from "@/content/commercial";
import { site } from "@/content/site";
import { getBookingDestination } from "@/lib/booking";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { HeroHeadline } from "@/components/sections/hero-headline";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const booking = getBookingDestination();
  const projectEntries = projects.map((project, index) => ({ project, index }));
  const renderProject = ({ project, index }: (typeof projectEntries)[number]) => <article className={`v2-home-project v2-home-project--${project.slug}`} key={project.slug} style={{ order: index }}>
    {project.slug === "visafile" ? <VisaFileProductImage /> : project.slug === "gradly-health" ? <GradlyProductImages /> : project.slug === "gradly-immigration" ? <GradlyImmigrationIllustration /> : project.slug === "ai-claims-adjudication" ? <ClaimsAdjudicationVisual /> : project.slug === "ai-insurance-concierge" ? <InsuranceConciergeVisual /> : <div className="project-media-placeholder" aria-label={`Placeholder for ${project.name} project image`}><div className="project-media-placeholder__window"><span /><span /><span /></div><div className="project-media-placeholder__canvas"><span /><span /><span /></div><p>Project image to come</p></div>}
    <div className="v2-home-project__copy"><span>0{index + 1} / {project.areas.join(" · ")}</span><h3>{project.name}</h3><p>{project.summary}</p>{project.slug === "gradly-health" ? <p className="v2-home-project__proof">10K+ members served · 25+ U.S. universities</p> : null}<Link href="/work">Read the project story →</Link></div>
  </article>;
  return <main id="main-content">
    <SiteShell className="hero v2-hero">
      <div>
        <p className="eyebrow">For founders who want to ship</p>
        <HeroHeadline />
        <p className="hero-copy">{site.hero.support}</p>
        <div className="hero-actions"><a className="button" href={booking.href} rel={booking.configured ? "noreferrer" : undefined} target={booking.configured ? "_blank" : undefined}>Talk to Animesh</a><Link className="text-link" href="/work">Show, don’t tell</Link></div>
      </div>
      <PrototypeIllustration />
    </SiteShell>
    <section className="v2-home-work" aria-labelledby="home-work-title"><div className="site-shell">
      <div className="v2-home-section-head"><div><p className="section-kicker">Selected work / {String(projects.length).padStart(2, "0")}</p><h2 id="home-work-title">Proof in the work.</h2></div><Link className="text-link" href="/work">Explore project stories →</Link></div>
      <div className="v2-home-work-grid">{([0, 1] as const).map((column) => <div className="v2-home-work-column" key={column}>{projectEntries.filter(({ index }) => index % 2 === column).map(renderProject)}</div>)}</div>
    </div></section>
    <section className="v2-home-services" aria-labelledby="home-services-title"><div className="site-shell">
      <div className="v2-home-section-head"><div><p className="section-kicker">Services</p><h2 id="home-services-title">Ways I can help.</h2></div><Link className="text-link" href="/services">How I work →</Link></div>
      <ol className="v2-home-service-list">{services.map((service, index) => <li key={service.slug}><span>0{index + 1}</span><div><h3>{service.name}</h3><p>{service.description}</p></div><span aria-hidden="true">↗</span></li>)}</ol>
      <div className="v2-home-process"><span>01 / Understand the workflow</span><span>02 / Shape and build</span><span>03 / Put it in people’s hands</span></div>
    </div></section>
    <section className="v2-home-pricing" aria-labelledby="home-pricing-title"><div className="site-shell">
      <div className="v2-home-section-head"><div><p className="section-kicker">Engagements</p><h2 id="home-pricing-title">Start at the right scale.</h2></div><Link className="text-link" href="/pricing">Explore pricing and fit →</Link></div>
      <p className="v2-home-section-intro">I scope the problem with you, then quote the work. Starting prices are under review.</p>
      <div className="v2-home-engagements">{engagements.map((engagement, index) => <article key={engagement.slug}><span>0{index + 1} / {engagement.featured ? "Core engagement" : "Starting point"}</span><h3>{engagement.name}</h3><p>{engagement.intent}</p><Link href="/pricing">See what’s included →</Link></article>)}</div>
    </div></section>
    <section className="v2-home-about" aria-labelledby="home-about-title"><div className="site-shell v2-home-about__layout"><div><p className="section-kicker">The person behind the work</p><h2 id="home-about-title">One person, close to the work.</h2></div><div><p>I’m Animesh Sharma. I work across product, engineering, and operations to turn an unclear problem into a useful system.</p><p>You work directly with the person shaping and building it. I keep the scope, constraints, and open questions visible.</p><Link className="text-link" href="/about">More about how I work →</Link></div></div></section>
    <section className="v2-home-faq" aria-labelledby="home-faq-title"><div className="site-shell v2-home-faq__layout"><div><p className="section-kicker">FAQ</p><h2 id="home-faq-title">Good questions.<br />Straight answers.</h2></div><FaqAccordion items={faqs.filter((faq) => faq.question !== "How current is the availability information?")} /></div></section>
    <section className="v2-home-close"><div className="site-shell"><p className="section-kicker">Have a rough brief?</p><h2>Bring the early version.</h2><p>Tell me what you need to build or untangle. I work directly across product and engineering.</p><div className="hero-actions"><a className="button button--light" href={booking.href} rel={booking.configured ? "noreferrer" : undefined} target={booking.configured ? "_blank" : undefined}>{booking.configured ? "Book a call" : "Request a call"}</a><Link className="text-link" href="/contact">Send a message →</Link></div></div></section>
  </main>;
}
