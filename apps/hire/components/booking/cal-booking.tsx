interface CalBookingProps {
  embedHref: string;
  externalHref: string;
}

export function CalBooking({ embedHref, externalHref }: CalBookingProps) {
  return (
    <div data-private className="cal-booking" data-reveal>
      <div className="cal-booking__heading">
        <div><p className="section-kicker">Choose a time</p><h3>Book directly with Cal.com</h3></div>
        <a data-analytics-event="booking_clicked" data-analytics-placement="booking" data-analytics-category="calendar" href={externalHref} rel="noreferrer" target="_blank">Open calendar in a new tab</a>
      </div>
      <iframe allow="payment; fullscreen" loading="lazy" src={embedHref} title="Book a call with Animesh using Cal.com" />
    </div>
  );
}
