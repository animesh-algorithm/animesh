import Link from "next/link";
import { ServicesSection } from "@/components/sections/services-section";
import { getBookingDestination } from "@/lib/booking";
export const metadata = { title: "Services", description: "MVP development, SaaS and web apps, AI features, and mobile apps.", alternates: { canonical: "/services" } };
export default function ServicesPage() { const booking = getBookingDestination(); return <main id="main-content"><ServicesSection /><div className="site-shell v2-page-tail"><h2>Start with the problem.</h2><p>I can define the right scope after seeing the workflow and what you need to ship.</p><div className="hero-actions"><a className="button" href={booking.href} rel={booking.configured ? "noreferrer" : undefined} target={booking.configured ? "_blank" : undefined}>{booking.configured ? "Book a call" : "Request a call"}</a><Link className="text-link" href="/contact">Send a brief</Link></div></div></main>; }
