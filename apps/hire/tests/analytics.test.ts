import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const sdk = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn(), stopSessionRecording: vi.fn(), startSessionRecording: vi.fn(), opt_out_capturing: vi.fn(), opt_in_capturing: vi.fn(), reset: vi.fn(), set_config: vi.fn() }));
vi.mock("posthog-js", () => ({ default: sdk }));
let stored: string | null;
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-project");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_ENVIRONMENT", "preview");
  stored = null;
  vi.stubGlobal("localStorage", { getItem: (key: string) => key === "optional-privacy:v1" ? stored : null });
  vi.stubGlobal("location", { origin: "https://example.test" });
  vi.stubGlobal("document", { referrer: "https://referrer.test/private?email=synthetic#secret" });
  sdk.init.mockReturnValue(sdk);
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("optional analytics privacy boundary", () => {
  it("initializes analytics and sampled replay without consent, ignoring old rejection", async () => {
    stored = JSON.stringify({ analytics: false, replay: false });
    const adapter = await import("../lib/analytics");
    adapter.pageview("/privacy");
    await adapter.initializeAnalytics();
    await adapter.initializeAnalytics();
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.capture).toHaveBeenCalledTimes(1);
    expect(sdk.startSessionRecording).toHaveBeenCalled();
    adapter.pageview("/"); adapter.pageview("/privacy");
    expect(sdk.capture).toHaveBeenCalledTimes(3);
  });
  it("stays disabled without configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "");
    const adapter = await import("../lib/analytics");
    await adapter.initializeAnalytics();
    expect(sdk.init).not.toHaveBeenCalled();
    expect(adapter.track("$pageview")).toBe(false);
  });
  it("initializes when browser storage is unavailable", async () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); } });
    const adapter = await import("../lib/analytics");
    await adapter.initializeAnalytics();
    expect(sdk.init).toHaveBeenCalled();
  });
  it("drops arbitrary properties and strips sensitive URL components from events and replay", async () => {
    const adapter = await import("../lib/analytics");
    expect(adapter.allowProperties({ outcome: "failed", ...{ email: "synthetic-secret", placement: "synthetic-secret" } } as never)).toEqual({ outcome: "failed" });
    expect(adapter.redactReplay({ href: "https://example.test/ask?synthetic-secret#secret", nested: [{ name: "https://referrer.test/?secret" }] })).toEqual({ href: "https://example.test/ask", nested: [{ name: "https://referrer.test/" }] });
    await adapter.initializeAnalytics();
    const config = sdk.init.mock.calls[0][1];
    const payload = config.before_send({ event: "$pageview", properties: { email: "synthetic-secret", $current_url: "https://example.test/?secret", $referrer: "https://referrer.test/?secret", $browser: "Chrome" } });
    expect(JSON.stringify(payload)).not.toContain("secret");
    expect(payload.properties.$referring_domain).toBe("referrer.test");
    expect(payload.properties.token).toBe("test-project");
    expect(payload.properties.$ip).toBe("0.0.0.0");
    expect(payload.properties.$geoip_disable).toBe(true);
    expect(config.session_recording.blockSelector).toContain("[data-private]");
    expect(config.session_recording.maskCapturedNetworkRequestFn({})).toBeNull();
    expect(config.session_recording.sampleRate).toBe(0.2);
    expect(config.advanced_disable_feature_flags).toBe(true);
    expect(config.advanced_disable_flags).toBeUndefined();
    expect(config.before_send({ event: "$snapshot", properties: {} })).not.toBeNull();
  });
  it("isolates blocked ingestion errors from the product", async () => {
    const adapter = await import("../lib/analytics");
    await adapter.initializeAnalytics();
    sdk.capture.mockImplementationOnce(() => { throw new Error("blocked"); });
    expect(() => adapter.track("contact_link_clicked", { category: "email" })).not.toThrow();
  });
});
