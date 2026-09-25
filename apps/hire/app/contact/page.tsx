import { InquirySection } from "@/components/sections/inquiry-section";
import { CalBooking } from "@/components/booking/cal-booking";
import { getBookingDestination } from "@/lib/booking";

export const metadata = { title: "Contact", description: "Book a call with Animesh Sharma or share a project brief.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  const booking = getBookingDestination();

  return (
    <main id="main-content" className="contact-page">
      <section className="contact-booking" aria-label="Book a call">
        <div className="site-shell">
          {booking.embedHref ? (
            <CalBooking embedHref={booking.embedHref} headingLevel="h1" />
          ) : (
            <div className="contact-booking__fallback" data-reveal>
              <p className="section-kicker">Start with a conversation</p>
              <h1>Let’s talk through your project.</h1>
              <p>Send me a few times that work for you and the rough version of what you’re building. I’ll help you find a useful place to start.</p>
              <a className="button" href={booking.href}>Request a call by email</a>
              <a className="contact-booking__message" href="#inquiry">Prefer to write? Send a brief</a>
            </div>
          )}
        </div>
      </section>
      <InquirySection />
    </main>
  );
}
