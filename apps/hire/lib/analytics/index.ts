import type { PostHog } from "posthog-js";

export const events = ["$pageview", "project_link_clicked", "contact_link_clicked", "booking_clicked", "inquiry_started", "inquiry_submitted", "inquiry_succeeded", "inquiry_failed"] as const;
export type AnalyticsEvent = typeof events[number];
export interface EventProperties {
  placement?: "header" | "hero" | "work" | "about" | "footer" | "widget" | "drawer" | "page" | "inquiry" | "booking" | "availability";
  project?: "visafile" | "gradly-health" | "gradly-links" | "claims";
  category?: "demo" | "source" | "email" | "social" | "calendar" | "resume";
  outcome?: "accepted" | "rejected" | "network" | "completed" | "failed";
}
const allowed = {
  placement: ["header", "hero", "work", "about", "footer", "widget", "drawer", "page", "inquiry", "booking", "availability"],
  project: ["visafile", "gradly-health", "gradly-links", "claims"],
  category: ["demo", "source", "email", "social", "calendar", "resume"],
  outcome: ["accepted", "rejected", "network", "completed", "failed"],
};
export function allowProperties(properties: EventProperties): Record<string, string> {
  return Object.fromEntries(Object.entries(properties).filter(([key, value]) => key in allowed && allowed[key as keyof typeof allowed].includes(value)));
}
export function redactReplay(value: unknown): unknown {
  if (typeof value === "string" && /^https?:\/\//.test(value)) {
    try { const url = new URL(value); return url.origin + url.pathname; } catch { return ""; }
  }
  if (Array.isArray(value)) return value.map(redactReplay);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactReplay(item)]));
  return value;
}
export const configured = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true"
  && !!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  && process.env.NEXT_PUBLIC_POSTHOG_HOST === "https://us.i.posthog.com"
  && ["preview", "production"].includes(process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT ?? "");
let client: PostHog | undefined;
let generation = 0;
let desiredAnalytics = false;
let lastPage: string | undefined;
let active = false;
let pathname = "/";
function safePath(path: string) { return ["/", "/ask", "/privacy"].includes(path) ? path : "/other"; }
export function track(event: AnalyticsEvent, properties: EventProperties = {}) {
  try {
    if (!active || !events.includes(event)) return false;
    client?.capture(event, { ...allowProperties(properties), app: "hire", environment: process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT, pathname: safePath(pathname) });
    return true;
  } catch { return false; /* Optional analytics never blocks product behavior. */ }
}
// Outcomes belong only to an action captured in the same initialization lifecycle.
export function interaction(event: AnalyticsEvent, properties: EventProperties = {}) {
  const captured = track(event, properties);
  const started = generation;
  return (outcome: AnalyticsEvent, outcomeProperties: EventProperties = {}) => {
    if (captured && started === generation) track(outcome, outcomeProperties);
  };
}
export function pageview(path: string) {
  pathname = path;
  if (!active || lastPage === path) return;
  lastPage = path;
  track("$pageview");
}
export async function initializeAnalytics() {
  const enabled = configured;
  if (enabled !== desiredAnalytics) { generation++; desiredAnalytics = enabled; }
  const current = generation;
  active = enabled && !!client;
  if (!enabled) {
    lastPage = undefined;
    try { client?.stopSessionRecording(); client?.opt_out_capturing(); client?.reset(true); client?.set_config({ disable_persistence: true }); } catch { /* Fail closed. */ }
    return;
  }
  try {
    if (!client) {
      const { default: posthog } = await import("posthog-js");
      if (current !== generation) return;
      client ??= posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
        api_host: "https://us.i.posthog.com", persistence: "localStorage", cross_subdomain_cookie: false,
        ip: false, person_profiles: "never", autocapture: false, capture_pageview: false, capture_pageleave: false,
        capture_exceptions: false, disable_surveys: true, advanced_disable_feature_flags: true,
        capture_performance: false, enable_recording_console_log: false, disable_session_recording: true,
        disable_capture_url_hashes: true, save_referrer: false, save_campaign_params: false,
        session_recording: {
          maskAllInputs: true, maskTextSelector: "[data-private]", blockSelector: "[data-private], iframe, a[href^=\"mailto:\"]",
          recordCrossOriginIframes: false, recordHeaders: false, recordBody: false, compress_events: false,
          maskAttributeFn: (name, value) => ["href", "src", "action"].includes(name) ? value.split(/[?#]/)[0] : value,
          maskCapturedNetworkRequestFn: () => null, sampleRate: 0.2,
        },
        before_send: (event) => {
          if (!event || !active) return null;
          event.properties.$ip = "0.0.0.0";
          event.properties.$geoip_disable = true;
          if (event.event === "$snapshot") {
            event.properties = redactReplay(event.properties) as typeof event.properties;
            return event;
          }
          if (!events.includes(event.event as AnalyticsEvent)) return null;
          const props = event.properties;
          const safe: Record<string, unknown> = { $ip: "0.0.0.0", $geoip_disable: true, token: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, ...allowProperties(props), app: "hire", environment: process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT, pathname: safePath(pathname), $current_url: location.origin + safePath(pathname) };
          for (const key of ["distinct_id", "$device_id", "$session_id", "$window_id", "$browser", "$browser_version", "$os", "$os_version", "$device_type", "$screen_height", "$screen_width", "$lib", "$lib_version", "$is_identified", "$process_person_profile"]) {
            if (key in props) safe[key] = props[key];
          }
          try { safe.$referring_domain = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* Ignore malformed referrers. */ }
          event.properties = safe;
          return event;
        },
      });
    }
    if (current !== generation) return;
    client?.set_config({ disable_persistence: false });
    client?.opt_in_capturing({ captureEventName: false });
    active = true;
    client?.set_config({ disable_session_recording: false });
    client?.startSessionRecording();
    pageview(pathname);
  } catch { active = false; }
}
