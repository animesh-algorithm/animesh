import type { Metadata } from "next";
import Link from "next/link";

import { FaqAccordion } from "@/components/faq/faq-accordion";
import { getBookingDestination } from "@/lib/booking";

export const metadata: Metadata = {
  title: "MVP Development",
  description:
    "From idea to first product. I help nontechnical founders scope, build, and launch a usable MVP, starting at $2,000 USD.",
  alternates: { canonical: "/services/mvp-development" },
  openGraph: {
    title: "MVP Development — Hire Animesh",
    description:
      "From idea to first product, with a scoped build and source-code handoff.",
    url: "/services/mvp-development",
  },
};

const steps = [
  {
    name: "Discover",
    description:
      "Tell me the problem, who the product is for, and what you need the first version to prove.",
  },
  {
    name: "Scope",
    description:
      "We choose the essential workflow, decide whether web or mobile fits, and agree on deliverables and a quote.",
  },
  {
    name: "Build",
    description:
      "I implement the agreed product and keep the work visible as the first version takes shape.",
  },
  {
    name: "Launch",
    description:
      "I deploy the scoped product and hand over its source code, with the known constraints made clear.",
  },
] as const;

const faqs = [
  {
    question: "Do I need designs ready?",
    answer:
      "You provide the UI designs for the build. If you do not have a designer, I can refer an independent one. I help shape the product direction and scope, but UI design is not included in my MVP build.",
  },
  {
    question: "Should the first version be web or mobile?",
    answer:
      "We decide during scoping, based on the main workflow and how people will use it. I can build a scoped web or mobile product.",
  },
  {
    question: "What does starting at $2,000 USD mean?",
    answer:
      "That is the starting price for a scoped MVP build. I quote the final price after we agree on the features, platform, and deliverables.",
  },
  {
    question: "Will I receive the source code?",
    answer:
      "Yes. The scoped build includes a source-code handoff when the product launches.",
  },
  {
    question: "What if I need changes after launch?",
    answer:
      "We can scope later changes or ongoing support separately and agree on a new quote.",
  },
] as const;

export default function MvpDevelopmentPage() {
  const booking = getBookingDestination();

  return (
    <main id="main-content" className="mvp-page">
      <section className="mvp-hero" aria-labelledby="mvp-title">
        <div className="site-shell mvp-hero__layout">
          <div>
            <Link className="mvp-back-link" href="/services">
              ← All services
            </Link>
            <p className="section-kicker">MVP development / 01</p>
            <h1 id="mvp-title">From idea to first product.</h1>
            <p className="mvp-hero__lead">
              Have a product idea but no technical team? I help you define the
              first useful version, build it, and get it into people’s hands.
            </p>
            <div className="hero-actions">
              <a className="button" href={booking.href}>
                {booking.configured ? "Book a call" : "Request a call"}
              </a>
              <Link className="text-link" href="/contact">
                Send a brief →
              </Link>
            </div>
          </div>
          <aside className="mvp-offer" aria-label="MVP engagement at a glance">
            <span>Scoped MVP build</span>
            <strong>
              Starting at $2,000 <small>USD</small>
            </strong>
            <p>
              Final price depends on the agreed features, platform, and
              deliverables.
            </p>
            <div>
              <span>01 / Define</span>
              <span>02 / Build</span>
              <span>03 / Launch</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="mvp-fit" aria-labelledby="mvp-fit-title">
        <div className="site-shell mvp-split">
          <div>
            <p className="section-kicker">Who this is for</p>
            <h2 id="mvp-fit-title">A first version you can put to work.</h2>
          </div>
          <div className="mvp-fit__copy">
            <p>
              This is for nontechnical founders who have a problem worth solving
              and need help turning it into a usable product. We start with the
              core workflow and choose the smallest build that can be launched
              and learned from.
            </p>
            <p>
              You bring the idea and UI designs. I bring product direction and
              engineering. If you need design help, I can refer an independent
              designer.
            </p>
            <Link className="text-link" href="/work">
              See the work →
            </Link>
          </div>
        </div>
      </section>

      <section className="mvp-included" aria-labelledby="mvp-included-title">
        <div className="site-shell">
          <p className="section-kicker">The build</p>
          <h2 id="mvp-included-title">A defined scope. A working handoff.</h2>
          <div className="mvp-included__grid">
            <p>
              The exact features are agreed before work begins. The MVP
              engagement covers product direction, implementation of the scoped
              web or mobile product, launch, and source-code handoff.
            </p>
            <div className="mvp-deliverables">
              <span>In the agreed scope</span>
              <ul>
                <li>Core product workflow and engineering build</li>
                <li>Web or mobile platform chosen for the problem</li>
                <li>Deployment of the first version</li>
                <li>Source code and known constraints at handoff</li>
              </ul>
            </div>
          </div>
          <p className="mvp-scope-note">
            UI design comes from you or an independent designer. Changes after
            launch and ongoing support are quoted separately.
          </p>
        </div>
      </section>

      <section className="mvp-process" aria-labelledby="mvp-process-title">
        <div className="site-shell">
          <p className="section-kicker">How we get there</p>
          <h2 id="mvp-process-title">
            From the loose idea to a shipped product.
          </h2>
          <ol className="mvp-process__steps">
            {steps.map((step, index) => (
              <li key={step.name}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{step.name}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mvp-faq" aria-labelledby="mvp-faq-title">
        <div className="site-shell mvp-split">
          <div>
            <p className="section-kicker">Before we start</p>
            <h2 id="mvp-faq-title">Good questions, clear answers.</h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="mvp-close" aria-labelledby="mvp-close-title">
        <div className="site-shell">
          <p className="section-kicker">Your first version</p>
          <h2 id="mvp-close-title">Tell me what you want to make possible.</h2>
          <p>
            Bring the rough idea. We can work out the right first scope
            together.
          </p>
          <div className="hero-actions">
            <a className="button button--light" href={booking.href}>
              {booking.configured ? "Book a call" : "Request a call"}
            </a>
            <Link className="text-link" href="/contact">
              Send a brief →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
