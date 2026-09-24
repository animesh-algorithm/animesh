import { comparisonRows, faqs } from "@/content/commercial";
import { site } from "@/content/site";
import { CalBooking } from "@/components/booking/cal-booking";
import { FaqAccordion } from "@/components/faq/faq-accordion";

interface FitSectionProps {
  bookingHref: string;
  bookingConfigured: boolean;
  bookingEmbedHref: string | null;
}

export function FitSection({ bookingHref, bookingConfigured, bookingEmbedHref }: FitSectionProps) {
  return (
    <section className="fit-section" aria-labelledby="fit-title">
      <div className="site-shell fit-heading" data-reveal>
        <div>
          <p className="section-kicker">The fit test</p>
          <h2 id="fit-title">A better fit when the problem needs a builder, not more handoffs.</h2>
        </div>
        <p>A larger partner can be the right answer. This is where an independent operator-builder is different.</p>
      </div>
      <div className="site-shell comparison-wrap" data-reveal>
        <table className="comparison-table">
          <caption className="sr-only">Comparison between a larger delivery partner and working directly with Animesh</caption>
          <thead><tr><th scope="col">Decision</th><th scope="col">Larger delivery partner</th><th scope="col">Working with Animesh</th></tr></thead>
          <tbody>
            {comparisonRows.map((row) => <tr key={row.topic}><th scope="row">{row.topic}</th><td>{row.largerPartner}</td><td>{row.independentBuilder}</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="site-shell faq-layout" id="faq">
        <div className="faq-heading" data-reveal><p className="section-kicker">FAQ</p><h2>Good questions.<br /><em>Straight answers.</em></h2></div>
        <FaqAccordion items={faqs} />
      </div>

      <div className="site-shell booking-panel" id="book" data-reveal>
        <div><p className="section-kicker">Start with a conversation</p><h2>Not sure which way in?</h2><p>Bring the rough version. I’ll help identify the right starting point.</p></div>
        <div className="booking-actions">
          <a className="button button--light" data-analytics-event="booking_clicked" data-analytics-placement="booking" data-analytics-category="calendar" href={bookingHref} rel={bookingConfigured ? "noreferrer" : undefined} target={bookingConfigured ? "_blank" : undefined}>{bookingConfigured ? "Book a call" : "Request a call"}</a>
          <a data-analytics-event="contact_link_clicked" data-analytics-placement="footer" data-analytics-category="email" href={`mailto:${site.email}`}>{site.email}</a>
          {!bookingConfigured ? <small>A scheduling URL has not been configured yet, so this opens a direct email request.</small> : null}
        </div>
      </div>
      {bookingConfigured && bookingEmbedHref ? <div className="site-shell"><CalBooking embedHref={bookingEmbedHref} externalHref={bookingHref} /></div> : null}
    </section>
  );
}
