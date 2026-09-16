import { availability } from "@/content/commercial";
import { AvailabilityPulse } from "@/components/availability/availability-pulse";

interface AvailabilityDockProps {
  bookingHref: string;
  configured: boolean;
}

export function AvailabilityDock({ bookingHref, configured }: AvailabilityDockProps) {
  return (
    <aside className="availability-dock" aria-label="Current availability">
      <AvailabilityPulse />
      <span className="availability-dock__copy"><strong>{availability.label}</strong><small>{availability.slots} slot · from {availability.nextStart}</small></span>
      <a href={bookingHref} rel={configured ? "noreferrer" : undefined} target={configured ? "_blank" : undefined}>
        {configured ? "Book a call" : "Request a call"}
      </a>
    </aside>
  );
}
