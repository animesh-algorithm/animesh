import { InquirySection } from "@/components/sections/inquiry-section";
import { getBookingDestination } from "@/lib/booking";
import { site } from "@/content/site";
export const metadata = { title: "Contact", description: "Share a project brief or request a call with Animesh Sharma.", alternates: { canonical: "/contact" } };
export default function ContactPage() { const booking = getBookingDestination(); return <main id="main-content"><InquirySection /><div className="site-shell v2-contact-options"><h2>Prefer a call or email?</h2><a className="button" href={booking.href} rel={booking.configured ? "noreferrer" : undefined} target={booking.configured ? "_blank" : undefined}>{booking.configured ? "Book a call" : "Request a call by email"}</a><a href={`mailto:${site.email}`}>{site.email}</a></div></main>; }
