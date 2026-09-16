interface AvailabilityPulseProps {
  className?: string;
}

export function AvailabilityPulse({ className }: AvailabilityPulseProps) {
  const classes = ["availability-ping", className].filter(Boolean).join(" ");

  return <span className={classes} aria-hidden="true" />;
}
