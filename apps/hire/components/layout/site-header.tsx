import Link from "next/link";
import { site } from "@/content/site";
import { SiteShell } from "@/components/layout/site-shell";
import { getBookingDestination } from "@/lib/booking";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PrimaryNav } from "@/components/layout/primary-nav";
import { AvailabilityPulse } from "@/components/availability/availability-pulse";
import {
  availabilityCapacity,
  availabilityStatus,
} from "@/lib/content/availability";

export function SiteHeader() {
  const booking = getBookingDestination();
  return (
    <div className="site-header-band">
      <SiteShell>
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label={`${site.name}, home`}>
            <span className="wordmark__text">
              <span>Hire</span>
              <span>Animesh</span>
            </span>
            <span className="wordmark__sun" aria-hidden="true" />
          </Link>
          <p className="sidebar-intro">Product Engineer for startups.</p>
          <div className="sidebar-actions">
            <p className="sidebar-actions__label">HAVE SOMETHING TO BUILD?</p>
            <a
              className="button sidebar-action"
              data-analytics-event="booking_clicked"
              data-analytics-placement="sidebar"
              data-analytics-category="calendar"
              href={booking.href}
              rel={booking.configured ? "noreferrer" : undefined}
              target={booking.configured ? "_blank" : undefined}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 3v4m10-4v4M3 10h18m-11 5 2 2 3-4" />
              </svg>
              <span>
                {booking.configured ? "Book a call" : "Request a call"}
              </span>
            </a>
            <Link className="sidebar-message" href="/contact">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              <span>Send a message</span>
            </Link>
          </div>
          <PrimaryNav navigation={site.navigation} />
          <div className="sidebar-facts" aria-label="Project information">
            <p>
              <span>Availability</span>
              <strong className="sidebar-availability">
                <AvailabilityPulse state={availabilityStatus.state} />
                {availabilityStatus.label}
              </strong>
              <small>{availabilityCapacity}</small>
            </p>
            <p>
              <span>Project timeline</span>
              <strong>Weeks, not months</strong>
            </p>
            {/* <p>
              <span>Work shown</span>
              <strong>05 project stories</strong>
            </p> */}
          </div>
          <div className="mobile-header-actions">
            <a
              className="mobile-booking"
              data-analytics-event="booking_clicked"
              data-analytics-placement="mobile_header"
              data-analytics-category="calendar"
              href={booking.href}
              rel={booking.configured ? "noreferrer" : undefined}
              target={booking.configured ? "_blank" : undefined}
            >
              {booking.configured ? "Book a call" : "Request a call"}
            </a>
            <MobileNav
              navigation={site.navigation}
              bookingHref={booking.href}
              bookingConfigured={booking.configured}
              availability={availabilityStatus}
            />
          </div>
        </header>
      </SiteShell>
    </div>
  );
}
