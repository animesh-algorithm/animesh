import { describe, expect, it } from "vitest";

import { availability, comparisonRows, engagements, faqs } from "@/content/commercial";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";

describe("published content", () => {
  it("keeps verified project claims and links auditable", () => {
    expect(projects).toHaveLength(4);
    expect(projects.find((project) => project.slug === "gradly-links")?.outcome).toBe(
      "Saved the company about $400 per month.",
    );
    expect(projects.find((project) => project.slug === "gradly-links")?.built).toContain("link.gradly.us");
    expect(projects.find((project) => project.slug === "visafile")?.links).toHaveLength(2);
  });

  it("marks every commercial value as provisional", () => {
    expect(site.provisional).toBe(true);
    expect(site.hero.provisional).toBe(true);
    expect(services.every((service) => service.provisional)).toBe(true);
    expect(engagements.every((engagement) => engagement.provisional)).toBe(true);
    expect(availability.provisional).toBe(true);
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
