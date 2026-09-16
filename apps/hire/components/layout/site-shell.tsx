import type { ReactNode } from "react";

interface SiteShellProps {
  children: ReactNode;
  className?: string;
}

export function SiteShell({ children, className }: SiteShellProps) {
  const classes = ["site-shell", className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}
