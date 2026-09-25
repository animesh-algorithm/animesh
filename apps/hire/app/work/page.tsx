import { WorkSection } from "@/components/sections/work-section";
import Link from "next/link";
import { getBookingDestination } from "@/lib/booking";
export const metadata = { title: "Work", description: "Selected product, automation, and internal systems built by Animesh Sharma.", alternates: { canonical: "/work" } };
export default function WorkPage() { const booking = getBookingDestination(); return <main id="main-content"><WorkSection /><section id="work-contact" className="site-shell v2-page-tail"><p className="section-kicker">Your project</p><h2>Have a similar problem?</h2><p>Show me the workflow and what the first useful version needs to do.</p><div className="hero-actions"><a className="button" href={booking.href}>{booking.configured ? "Book a call" : "Request a call"}</a><Link className="text-link" href="/contact">Send a brief</Link></div></section></main>; }
