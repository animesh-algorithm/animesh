"use client";

import { useEffect } from "react";

/** Progressive enhancement: server-rendered content stays visible without JS. */
export function ScrollMotion() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    function configure() {
      dispose();
      if (preference.matches) return;
      const animations: Animation[] = [];
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          const element = target as HTMLElement;
          // Animate only on entry; never leave offscreen content hidden.
          const animation = element.animate([
            { opacity: 0.25, transform: "translateY(64px) rotate(1.2deg) scale(.97)" },
            { opacity: 1, transform: "translateY(0) rotate(0) scale(1)" },
          ], { duration: 900, easing: "cubic-bezier(.16,1,.3,1)", delay: Number(element.dataset.motionOrder ?? 0) * 90 });
          animations.push(animation);
          observer.unobserve(element);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll<HTMLElement>(".section-heading, .project, .about-copy, .experience-row, .note-row, .contact-inner").forEach((element, index) => {
        element.dataset.motionOrder = String(index % 3);
        observer.observe(element);
      });
      let frame = 0;
      const render = () => {
        frame = 0;
        const root = document.documentElement;
        const range = root.scrollHeight - innerHeight;
        root.style.setProperty("--scroll-progress", String(range > 0 ? scrollY / range : 0));
        document.querySelectorAll<HTMLElement>(".project-visual-link").forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > innerHeight) return;
          const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight));
          element.style.setProperty("--scene-shift", `${progress * 24}px`);
          element.style.setProperty("--scene-tilt", `${progress * -1.5}deg`);
        });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
      addEventListener("scroll", schedule, { passive: true });
      addEventListener("resize", schedule);
      render();
      dispose = () => {
        observer.disconnect();
        animations.forEach((animation) => animation.cancel());
        cancelAnimationFrame(frame);
        removeEventListener("scroll", schedule);
        removeEventListener("resize", schedule);
        document.documentElement.style.removeProperty("--scroll-progress");
        document.querySelectorAll<HTMLElement>(".project-visual-link").forEach((element) => {
          element.style.removeProperty("--scene-shift");
          element.style.removeProperty("--scene-tilt");
        });
      };
    }
    configure();
    preference.addEventListener("change", configure);
    return () => { dispose(); preference.removeEventListener("change", configure); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}
