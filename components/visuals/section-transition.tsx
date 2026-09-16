type TransitionSurface = "paper" | "ink" | "warm" | "cobalt" | "lilac";
type TransitionVariant = "drift" | "swell" | "gentle";

interface SectionTransitionProps {
  from: TransitionSurface;
  to: TransitionSurface;
  variant?: TransitionVariant;
  compact?: boolean;
}

const paths: Record<TransitionVariant, string> = {
  drift: "M0 18C154 2 312 34 474 17C642 0 782 34 946 19C1114 4 1278 31 1440 12V96H0Z",
  swell: "M0 12C178 32 322 3 496 17C672 32 820 2 982 15C1152 29 1294 5 1440 21V96H0Z",
  gentle: "M0 16C170 4 302 2 460 15C624 29 748 31 912 16C1080 1 1262 5 1440 20V96H0Z",
};

export function SectionTransition({
  from,
  to,
  variant = "drift",
  compact = false,
}: SectionTransitionProps) {
  const classes = [
    "section-transition",
    `section-transition--to-${to}`,
    compact ? "section-transition--compact" : null,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} data-from={from} aria-hidden="true">
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none">
        <path d={paths[variant]} />
      </svg>
    </div>
  );
}
