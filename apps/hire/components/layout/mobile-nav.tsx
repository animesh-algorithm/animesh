"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AvailabilityPulse } from "@/components/availability/availability-pulse";
import { availabilityCapacity } from "@/lib/content/availability";
import type { AvailabilityState } from "@/lib/content/availability";

interface MobileNavProps {
  navigation: readonly { label: string; href: string }[];
  bookingHref: string;
  bookingConfigured: boolean;
  availability: { state: AvailabilityState; label: string };
}

export function MobileNav({ navigation, bookingHref, bookingConfigured, availability }: MobileNavProps) {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  return <details className="mobile-nav" ref={detailsRef}>
    <summary aria-label="Open navigation menu"><span aria-hidden="true" className="mobile-nav__icon"><i /><i /><i /></span></summary>
    <nav aria-label="Mobile navigation">
      <div className="mobile-nav__availability"><span><AvailabilityPulse state={availability.state} />{availability.label}</span><small>{availabilityCapacity}</small></div>
      {navigation.map((item) => {
        const href = pathname === "/" ? ({ "/": "#main-content", "/work": "#work", "/services": "#services", "/pricing": "#pricing", "/about": "#about", "/contact": "#inquiry" } as Record<string, string>)[item.href] ?? item.href : item.href;
        return <Link href={href} key={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => { if (detailsRef.current) detailsRef.current.open = false; }}><span>{item.label}</span></Link>;
      })}
      <a href={bookingHref} rel={bookingConfigured ? "noreferrer" : undefined} target={bookingConfigured ? "_blank" : undefined}><span>{bookingConfigured ? "Book a call" : "Request a call"}</span></a>
    </nav>
  </details>;
}
