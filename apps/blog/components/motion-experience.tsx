"use client";

import { useEffect } from "react";
import { animate, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import { motionTokens, springs } from "@/lib/motion-tokens";

const revealSelector = [
  ".intro-content > *",
  ".search",
  ".mobile-topics",
  ".results-bar",
  ".clear-filter",
  ".post-row",
  ".topics > *",
  ".article-header-content > *",
  ".prose > *",
  ".toc",
  ".related > *",
  ".footer-content > *",
].join(",");

export function MotionExperience() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, springs.progress);

  useEffect(() => {
    const root = document.documentElement;
    const isLowEnd =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;

    root.dataset.motion =
      prefersReducedMotion || isLowEnd ? "static" : "enhanced";

    if (prefersReducedMotion || isLowEnd || !("IntersectionObserver" in window)) return;

    const targets = new Set<HTMLElement>();
    const animations = new Set<ReturnType<typeof animate>>();
    const reveal = (target: HTMLElement) => {
      if (target.classList.contains("is-revealed")) return;
      target.classList.add("is-revealed");
      const animation = animate(target, {
        opacity: [0, 1],
        y: [motionTokens.distance.md, 0],
      }, {
        duration: motionTokens.duration.slow,
        ease: motionTokens.easing.smooth,
      });
      animations.add(animation);
      void animation.then(() => {
        animations.delete(animation);
        target.style.removeProperty("opacity");
        target.style.removeProperty("transform");
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0 },
    );

    const register = () => {
      for (const target of document.querySelectorAll<HTMLElement>(revealSelector)) {
        if (targets.has(target)) continue;
        targets.add(target);
        target.dataset.reveal = "";
        if (target.getBoundingClientRect().top < window.innerHeight * 0.92) {
          target.classList.add("is-revealed");
        } else observer.observe(target);
      }
    };
    register();
    root.dataset.motionReady = "true";
    const mutations = new MutationObserver(register);
    mutations.observe(document.body, { childList: true, subtree: true });
    const focus = (event: FocusEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-reveal]");
      if (target) {
        target.classList.add("is-revealed");
        observer.unobserve(target);
      }
    };
    document.addEventListener("focusin", focus);

    let frame = 0;
    const updateDepth = () => {
      frame = 0;
      for (const scene of document.querySelectorAll<HTMLElement>(".intro,.article-cloud-header")) {
        const bounds = scene.getBoundingClientRect();
        const depth = Math.max(0, Math.min(1, -bounds.top / bounds.height));
        scene.style.setProperty("--scroll-depth", `${depth * motionTokens.distance.lg}px`);
      }
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(updateDepth);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    updateDepth();

    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("focusin", focus);
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
      for (const animation of animations) animation.stop();
      for (const scene of document.querySelectorAll<HTMLElement>(".intro,.article-cloud-header")) {
        scene.style.removeProperty("--scroll-depth");
      }
      delete root.dataset.motionReady;
      for (const target of targets) {
        target.classList.remove("is-revealed");
        delete target.dataset.reveal;
        target.style.removeProperty("--reveal-order");
        target.style.removeProperty("opacity");
        target.style.removeProperty("transform");
      }
    };
  }, [pathname, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="reading-progress"
      style={{ scaleX: progress }}
      aria-hidden="true"
    />
  );
}
