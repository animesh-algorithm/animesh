"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function MotionDirector() {
  const pathname = usePathname();
  const isWorkPage = pathname === "/work";
  const isHomePage = pathname === "/";
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [nextTarget, setNextTarget] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const handleVisibility = () => root.classList.toggle("is-tab-hidden", document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", handleVisibility);

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const floatingMediaSelector = ".visafile-product-image__window, .gradly-product-images__window, .gradly-immigration-illustration__window, .gradly-links__window, .gradly-phone, .claims-phone";
    const selector = "[data-reveal], main.privacy-page, main > section, main > .hero, main > div, main article, main ol > li, .v2-home-service-list li, .v2-about-grid > div, .v2-page-tail, .v2-contact-options";
    const reveal = (element: Element) => {
      element.classList.remove("motion-pending");
      element.classList.add("motion-visible");
      observer?.unobserve(element);
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    const scan = () => {
      document.querySelectorAll(selector).forEach((element) => {
        if (element.classList.contains("motion-visible") || element.classList.contains("motion-pending")) return;
        if (preference.matches || element.getBoundingClientRect().top < window.innerHeight * 0.98) {
          element.classList.add("motion-visible");
          return;
        }
        element.classList.add("motion-pending");
        observer?.observe(element);
      });
    };
    const showAll = () => document.querySelectorAll(".motion-pending").forEach(reveal);
    const handlePreference = () => { if (preference.matches) showAll(); else scan(); updateScroll(); };
    const handleFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const pending = target.closest(".motion-pending");
      if (pending) reveal(pending);
    };
    let frame = 0;
    let scanFrame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty("--hire-scroll-progress", String(range > 0 ? Math.min(1, window.scrollY / range) : 1));
        const atBottom = range > 0 && range - window.scrollY <= 96;
        setShowScrollTop(isWorkPage || isHomePage ? atBottom : window.scrollY > 500);
        if (isWorkPage || isHomePage) {
          const projects = Array.from(document.querySelectorAll<HTMLElement>(".work-section .project-story"));
          const contact = document.getElementById("work-contact");
          if (atBottom) {
            setNextTarget(null);
          } else if (isHomePage) {
            const targetIds = ["work", ...projects.map((project) => project.id), "services", "pricing", "fit", "faq", "book", "about", "inquiry"];
            const targets = targetIds.map((id) => document.getElementById(id)).filter((target): target is HTMLElement => target !== null);
            const next = targets.find((target) => target.getBoundingClientRect().top > window.innerHeight * 0.5);
            setNextTarget(next?.id ?? null);
          } else if (contact && contact.getBoundingClientRect().top <= window.innerHeight * 0.55) {
            setNextTarget(null);
          } else if (projects.length) {
            let currentIndex = 0;
            projects.forEach((project, index) => {
              if (project.getBoundingClientRect().top <= window.innerHeight * 0.5) currentIndex = index;
            });
            setNextTarget(projects[currentIndex + 1]?.id ?? "work-contact");
          }
        }
        if (!preference.matches) document.querySelectorAll<HTMLElement>(floatingMediaSelector).forEach((element) => {
          const frame = element.parentElement?.getBoundingClientRect();
          if (!frame || frame.bottom < 0 || frame.top > window.innerHeight) return;
          const progress = Math.max(0, Math.min(1, (window.innerHeight - frame.top) / (window.innerHeight + frame.height)));
          element.style.setProperty("--showcase-scroll-shift", `${((progress - 0.5) * 16).toFixed(2)}px`);
        });
        document.querySelectorAll(".motion-pending").forEach((element) => {
          if (element.getBoundingClientRect().top < window.innerHeight * 0.98) reveal(element);
        });
      });
    };
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(scanFrame);
      scanFrame = requestAnimationFrame(() => { scan(); updateScroll(); });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    preference.addEventListener("change", handlePreference);
    document.addEventListener("focusin", handleFocus);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    scan();
    updateScroll();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("focusin", handleFocus);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      preference.removeEventListener("change", handlePreference);
      mutations.disconnect();
      observer?.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scanFrame);
      // React may rerun this effect in development. Clear stale hidden state so
      // the next scan can observe off-screen sections and animate them on entry.
      document.querySelectorAll(".motion-pending").forEach((element) => element.classList.remove("motion-pending"));
      root.classList.remove("is-tab-hidden");
      root.style.removeProperty("--hire-scroll-progress");
    };
  }, [isHomePage, isWorkPage]);

  return <>
    <div className="hire-scroll-progress" aria-hidden="true" />
    {(isWorkPage || isHomePage) && !showScrollTop && nextTarget && <a
      className="hire-scroll-top hire-scroll-next"
      href={`#${nextTarget}`}
      aria-label={nextTarget === "work-contact" || nextTarget === "inquiry" ? "Scroll to contact" : isHomePage ? "Scroll to next section" : "Scroll to next project"}
    >
      <svg aria-hidden="true" width="26" height="26" viewBox="0 0 20 20" fill="none">
        <path d="M10 4v12m0 0-5-5m5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>}
    {showScrollTop && <button
      className={`hire-scroll-top${isWorkPage || isHomePage ? " hire-scroll-up" : ""}`}
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
    >
      <svg aria-hidden="true" width="26" height="26" viewBox="0 0 20 20" fill="none">
        <path d="M10 16V4m0 0-5 5m5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>}
  </>;
}
