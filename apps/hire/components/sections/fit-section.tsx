import { comparisonRows, faqs } from "@/content/commercial";
import { FaqAccordion } from "@/components/faq/faq-accordion";

export function FitSection() {
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
    </section>
  );
}
