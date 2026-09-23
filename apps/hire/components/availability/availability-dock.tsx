import { availabilityCapacity, availabilityStatus } from "@/lib/content/availability";
import { AvailabilityPulse } from "@/components/availability/availability-pulse";

interface AvailabilityDockProps {
  bookingHref: string;
  configured: boolean;
}

export function AvailabilityDock({ bookingHref, configured }: AvailabilityDockProps) {
  return (
    <aside className="availability-dock" aria-label="Current availability">
      <AvailabilityPulse state={availabilityStatus.state} />
      <span className="availability-dock__copy"><strong>{availabilityStatus.label}</strong><small>{availabilityCapacity}</small></span>
      <a data-analytics-event="booking_clicked" data-analytics-placement="booking" data-analytics-category="calendar" href={bookingHref} rel={configured ? "noreferrer" : undefined} target={configured ? "_blank" : undefined}>
        {configured ? "Book a call" : "Request a call"}
      </a>
    </aside>
  );
}
