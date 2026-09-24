import Link from "next/link";
import { services } from "@/content/services";

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
                <p>{service.description}</p>
                <Link className="service-detail-link" href={`/services/${service.slug}`}>
                  Explore {service.name} →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
