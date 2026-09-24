import { site } from "@/content/site";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { availabilityStatus } from "@/lib/content/availability";
import { AvailabilityPulse } from "@/components/availability/availability-pulse";

export function InquirySection({ home = false }: { home?: boolean }) {
  return (
    <section data-private className="inquiry-section" id="inquiry" aria-labelledby="inquiry-title">
      <div className="site-shell inquiry-layout">
        <div className="inquiry-intro" data-reveal>
          <p className="section-kicker">Start a conversation</p>
          {home ? <h2 id="inquiry-title">What is your team working around?</h2> : <h1 id="inquiry-title">What is your team working around?</h1>}
          <p>Share the rough version. A workflow, a product idea, a pile of handoffs, or the thing everyone knows needs fixing.</p>
          <p className="inquiry-availability"><AvailabilityPulse state={availabilityStatus.state} /><span>Current status: {availabilityStatus.label}. I update this manually; we can discuss timing in your brief.</span></p>
        </div>
        <div data-reveal><InquiryForm email={site.email} /></div>
      </div>
    </section>
  );
}
