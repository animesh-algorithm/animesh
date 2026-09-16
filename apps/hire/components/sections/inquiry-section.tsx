import { availability } from "@/content/commercial";
import { site } from "@/content/site";
import { InquiryForm } from "@/components/inquiry/inquiry-form";

export function InquirySection() {
  return (
    <section data-private className="inquiry-section" id="inquiry" aria-labelledby="inquiry-title">
      <div className="site-shell inquiry-layout">
        <div className="inquiry-intro" data-reveal>
          <p className="section-kicker">Start a conversation</p>
          <h2 id="inquiry-title">What is your team working around?</h2>
          <p>Share the rough version. A workflow, a product idea, a pile of handoffs, or the thing everyone knows needs fixing.</p>
          <div className="availability-card">
            <span>Current availability</span>
            <strong>{availability.label}</strong>
            <p>{availability.slots} project slot · next start {availability.nextStart}</p>
            <small>Manually maintained; not live calendar data.</small>
          </div>
        </div>
        <div data-reveal><InquiryForm email={site.email} /></div>
      </div>
    </section>
  );
}
