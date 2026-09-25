import Link from "next/link";
import { site } from "@/content/site";
import { getBookingDestination } from "@/lib/booking";

export function AboutSection({ home = false }: { home?: boolean }) {
  const booking = getBookingDestination();
  return <section className="v2-about" id="about" aria-labelledby="about-title"><div className="site-shell">
    <p className="section-kicker">About / {site.person}</p>
    {home ? <h2 id="about-title">One person, close to the work.</h2> : <h1 id="about-title">One person, close to the work.</h1>}
    <p className="v2-lead">I work across product, engineering, and operations. I like the ambiguous part: finding the actual problem, shaping a useful system, and getting it into people’s hands.</p>
    <div className="v2-about-grid"><div><h3>Direct collaboration</h3><p>You work with the person making the product and engineering decisions. I keep the scope, constraints, and open questions visible.</p></div><div><h3>Useful over elaborate</h3><p>A first version should help people do something real. I start with the workflow and choose the smallest build that can be tested.</p></div></div>
    <div className="hero-actions"><a className="button" href={booking.href}>{booking.configured ? "Book a call" : "Request a call"}</a><Link className="text-link" href={home ? "#work" : "/work"}>See what I’ve built</Link></div>
  </div></section>;
}
