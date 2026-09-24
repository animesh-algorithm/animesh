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
      <div className="fit-comparison-stage" id="fit">
        <div className="site-shell fit-heading" data-reveal>
          <p className="section-kicker">The fit test</p>
          <h2 id="fit-title">Less process. <em>More shipping.</em></h2>
        </div>
        <div className="site-shell comparison-wrap" data-reveal>
          <table className="comparison-table">
            <caption className="sr-only">Typical agency compared with working directly with Animesh</caption>
            <thead><tr><th scope="col"><span className="sr-only">Comparison point</span></th><th scope="col">Typical agency</th><th scope="col">Work with me</th></tr></thead>
            <tbody>
              {comparisonRows.map((row) => <tr key={row.topic}><th scope="row">{row.topic}</th><td data-label="Typical agency">{row.largerPartner}</td><td data-label="Work with me">{row.independentBuilder}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="faq-stage" id="faq">
        <div className="site-shell faq-layout">
          <div className="faq-heading" data-reveal><p className="section-kicker">FAQ</p><h2>Good questions.<br /><em>Straight answers.</em></h2></div>
          <FaqAccordion items={faqs} />
        </div>
      </div>

      <div className="booking-stage" id="book">
        {bookingConfigured && bookingEmbedHref ? <div className="booking-stage__calendar"><CalBooking embedHref={bookingEmbedHref} externalHref={bookingHref} /></div> : <div className="site-shell booking-fallback" data-reveal><p className="section-kicker">Start with a conversation</p><h2>Book a call.</h2><p>Bring the rough version. I’ll help identify the right starting point.</p><a className="button" href={bookingHref}>Request a call</a><a href={`mailto:${site.email}`}>{site.email}</a></div>}
      </div>
    </section>
  );
}
