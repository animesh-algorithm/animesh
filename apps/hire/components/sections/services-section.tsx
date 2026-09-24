import Link from "next/link";
import { services } from "@/content/services";

function ProcessCurve({ direction }: { direction: "loose" | "ordered" }) {
  const horizontalPath =
    direction === "loose"
      ? "M3 22C21 2 36 37 54 17C68 2 78 10 93 15"
      : "M3 19C24 6 39 29 58 15C70 7 81 9 93 15";
  const verticalPath =
    direction === "loose"
      ? "M18 3C2 22 35 36 17 55C5 68 13 82 19 93"
      : "M18 3C7 24 29 39 17 56C9 69 13 82 19 93";

  return (
    <>
      <svg
        className={`process-curve process-curve--horizontal process-curve--${direction}`}
        viewBox="0 0 96 38"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={horizontalPath} />
        <circle cx="93" cy="15" r="3" />
      </svg>
      <svg
        className={`process-curve process-curve--vertical process-curve--${direction}`}
        viewBox="0 0 38 96"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={verticalPath} />
        <circle cx="19" cy="93" r="3" />
      </svg>
    </>
  );
}

export function ServicesSection() {
  return (
    <section
      className="services-section"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="site-shell services-layout">
        <div className="section-heading section-heading--sticky" data-reveal>
          <p className="section-kicker">Services / 04</p>
          <h1 id="services-title">Here&apos;s what I do.</h1>
          <p>
            I work across product, engineering, and operations to turn a fuzzy
            problem into something people can use.
          </p>
        </div>
        <ol className="service-list">
          {services.map((service, index) => (
            <li key={service.slug} data-reveal>
              <span className="service-number">0{index + 1}</span>
              <div>
                <h2>{service.name}</h2>
                {/* <p className="service-question">{service.question}</p> */}
                <p>{service.description}</p>
                <Link
                  className="service-detail-link"
                  href={`/services/${service.slug}`}
                >
                  Explore {service.name} →
                </Link>
              </div>
            </li>
          ))}
        </ol>
        {/* </div>
      <div
        className="site-shell process-strip"
        aria-label="Working process"
        data-reveal
      >
        <div>
          <span>messy input</span>
          <strong>Understand the real workflow</strong>
        </div>
        <div className="process-line process-line--messy">
          <ProcessCurve direction="loose" />
        </div>
        <div>
          <span>useful system</span>
          <strong>Shape, build, and test</strong>
        </div>
        <div className="process-line process-line--ordered">
          <ProcessCurve direction="ordered" />
        </div>
        <div>
          <span>shipped</span>
          <strong>Put it in people’s hands</strong>
        </div> */}
      </div>
    </section>
  );
}
