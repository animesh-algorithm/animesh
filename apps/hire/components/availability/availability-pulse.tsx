interface AvailabilityPulseProps {
  className?: string;
  state?: "available" | "limited" | "booked";
}

export function AvailabilityPulse({ className, state = "limited" }: AvailabilityPulseProps) {
  const classes = ["availability-ping", `availability-ping--${state}`, className].filter(Boolean).join(" ");

  return <span className={classes} aria-hidden="true" />;
}
