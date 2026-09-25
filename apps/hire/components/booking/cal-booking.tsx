interface CalBookingProps {
  embedHref: string;
  headingLevel?: "h1" | "h2";
  inquiryHref?: string;
}

export function CalBooking({ embedHref, headingLevel = "h2", inquiryHref = "/contact#inquiry" }: CalBookingProps) {
  const Heading = headingLevel;
  return (
    <div data-private className="cal-booking" data-reveal>
      <div className="cal-booking__heading">
        <div className="cal-booking__intro">
          <p className="section-kicker">Start with a conversation</p>
          <Heading>Let’s talk through <em>your project.</em></Heading>
          <p>Choose a time below. Bring the rough version of what you’re building; I’ll help you find a useful place to start.</p>
        </div>
        <a className="cal-booking__message" href={inquiryHref}>Prefer to write? Send a brief</a>
      </div>
      <iframe allow="payment; fullscreen" loading="lazy" src={embedHref} title="Book a call with Animesh using Cal.com" />
    </div>
  );
}
