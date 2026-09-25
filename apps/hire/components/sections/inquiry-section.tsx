import { site } from "@/content/site";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { availabilityStatus } from "@/lib/content/availability";
import { AvailabilityPulse } from "@/components/availability/availability-pulse";

export function InquirySection() {
  return (
    <section data-private className="inquiry-section" id="inquiry" aria-labelledby="inquiry-title">
      <div className="site-shell inquiry-layout">
        <div className="inquiry-intro" data-reveal>
          <div className="inquiry-intro__main">
            <p className="section-kicker">Start a conversation <span aria-hidden="true">/ 01</span></p>
            <h2 id="inquiry-title">What is your team <em>working around?</em></h2>
          </div>
          <div className="inquiry-intro__aside">
            <p>Share the rough version. A workflow, a product idea, a pile of handoffs, or the thing everyone knows needs fixing.</p>
            <p className="inquiry-availability"><AvailabilityPulse state={availabilityStatus.state} /><span>Current status: {availabilityStatus.label}. I update this manually; we can discuss timing in your brief.</span></p>
          </div>
        </div>
        <p className="inquiry-scroll-hint">Scroll to complete the brief.</p>
        <div className="inquiry-form-wrap" data-reveal><InquiryForm email={site.email} /></div>
      </div>
    </section>
  );
}
