"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initializeAnalytics, pageview, track, type AnalyticsEvent, type EventProperties } from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  useEffect(() => { void initializeAnalytics(); }, []);
  useEffect(() => { pageview(pathname); }, [pathname]);
  useEffect(() => {
    function click(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[data-analytics-event]");
      if (!link) return;
      track(link.dataset.analyticsEvent as AnalyticsEvent, {
        placement: link.dataset.analyticsPlacement,
        project: link.dataset.analyticsProject,
        category: link.dataset.analyticsCategory,
      } as EventProperties);
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
