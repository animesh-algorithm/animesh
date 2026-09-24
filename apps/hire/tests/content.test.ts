import { describe, expect, it } from "vitest";

import { availability, comparisonRows, engagements, faqs } from "@/content/commercial";
import { experiments, projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { getAvailabilityStatus } from "@/lib/content/availability";

describe("published content", () => {
  it("keeps verified project claims and links auditable", () => {
    expect(projects).toHaveLength(8);
    expect(experiments.map((project) => project.slug)).toEqual(["sortify", "crate"]);
    expect(experiments.map((project) => project.links[0]?.href)).toEqual([
      "https://sortifi.vercel.app/",
      "https://crate-nu-lilac.vercel.app/",
    ]);
    expect(projects.find((project) => project.slug === "fivepoints")?.links[0]?.href).toBe("https://five-points.netlify.app/");
    expect(projects.find((project) => project.slug === "ai-insurance-concierge")?.constraint).toContain("verified member records");
    expect(projects.find((project) => project.slug === "gradly-immigration")?.links[0]?.href).toBe("https://gradly.us/");
    expect(projects.find((project) => project.slug === "gradly-links")?.outcome).toBe(
      "Saved the company about $400 per month.",
    );
    expect(projects.find((project) => project.slug === "gradly-links")?.built).toContain("link.gradly.us");
    expect(projects.find((project) => project.slug === "visafile")?.links).toHaveLength(2);
    const gradly = projects.find((project) => project.slug === "gradly-health");
    expect(gradly?.outcome).toEqual([
      "10K+ members served across 25+ U.S. universities.",
      "Across four sales cycles, annual premium volume grew from $1.2M to $2.4M.",
      "Across four sales cycles, net revenue margin grew from ~12% to ~35%.",
    ]);
    expect(gradly?.built).toContain("5 carrier partners");
  });

  it("distinguishes the confirmed MVP service from provisional commercial values", () => {
    expect(site.provisional).toBe(true);
    expect(site.hero.provisional).toBe(false);
    expect(services.find((service) => service.slug === "mvp-development")?.provisional).toBe(false);
    expect(services.filter((service) => service.slug !== "mvp-development").every((service) => service.provisional)).toBe(true);
    expect(engagements.every((engagement) => engagement.provisional)).toBe(true);
    expect(availability.activeProjects).toBe(1);
  });

  it("derives availability from the manually maintained project count", () => {
    expect(getAvailabilityStatus(0)).toEqual({ state: "available", label: "Available" });
    expect(getAvailabilityStatus(1)).toEqual({ state: "limited", label: "Limited availability" });
    expect(getAvailabilityStatus(2)).toEqual({ state: "booked", label: "Booked" });
    expect(() => getAvailabilityStatus(3)).toThrow(RangeError);
  });

  it("keeps the verified direct contact available", () => {
    expect(site.email).toBe("hello.animeshsharma@gmail.com");
    expect(site.bookingUrl).toBe("https://cal.com/meet-animesh/30min");
    expect("location" in site).toBe(false);
  });

  it("keeps the expanded commercial guidance auditable", () => {
    expect(engagements.every((engagement) => engagement.fit.length >= 2)).toBe(true);
    expect(engagements.every((engagement) => engagement.included.length >= 2)).toBe(true);
    expect(engagements.every((engagement) => engagement.notIncluded.length >= 1)).toBe(true);
    expect(engagements.filter((engagement) => engagement.featured)).toHaveLength(1);
    expect(comparisonRows).toHaveLength(4);
    expect(faqs.length).toBeGreaterThanOrEqual(5);
  });
});
