import { getBookingDestination } from "@/lib/booking";
import { site } from "@/content/site";

export function ContactOptions() {
  const booking = getBookingDestination();
  return <div className="site-shell v2-contact-options"><h2>Prefer a call or email?</h2><a className="button" href={booking.href} rel={booking.configured ? "noreferrer" : undefined} target={booking.configured ? "_blank" : undefined}>{booking.configured ? "Book a call" : "Request a call by email"}</a><a href={`mailto:${site.email}`}>{site.email}</a></div>;
}
