"use client";

import { useLayoutEffect } from "react";

const motion = {
  easing: "cubic-bezier(.16, 1, .3, 1)",
  duration: { row: 760, section: 1_050, project: 1_180 },
  stagger: 90,
} as const;

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const viewportProgress = (element: HTMLElement, viewportHeight: number) => {
  const rect = element.getBoundingClientRect();
  return clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
};

type RevealKind = "heading" | "project" | "copy" | "row" | "contact";

const revealFrames = (kind: RevealKind, index: number): Keyframe[] => {
  const direction = index % 2 === 0 ? -1 : 1;

  if (kind === "project") {
    return [
      { opacity: 0, transform: `translate3d(${direction * 42}px, 124px, 0) rotate(${direction * 1.8}deg) scale(.94)` },
      { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0) scale(1)" },
    ];
  }
  if (kind === "row") {
    return [
      { opacity: 0, transform: `translate3d(${direction * 68}px, 34px, 0) skewY(${direction * 1.2}deg)` },
      { opacity: 1, transform: "translate3d(0, 0, 0) skewY(0)" },
    ];
  }
  if (kind === "contact") {
    return [
      { opacity: 0, transform: "translate3d(0, 140px, 0) scale(.93)" },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
    ];
  }

  const x = kind === "copy" ? direction * 54 : 0;
  return [
    { opacity: 0, transform: `translate3d(${x}px, 92px, 0) rotate(${direction * 1.1}deg) scale(.96)` },
    { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0) scale(1)" },
  ];
};

/** Progressive enhancement: server-rendered content stays visible without JS. */
export function ScrollMotion() {
  useLayoutEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    function configure() {
      dispose();
      if (preference.matches) return;

      const root = document.documentElement;
      const animations: Animation[] = [];
      const projects = Array.from(document.querySelectorAll<HTMLElement>(".project"));
      const experiments = document.querySelector<HTMLElement>(".experiments-shelf");
      const experimentRows = Array.from(document.querySelectorAll<HTMLElement>(".experiment-row"));
      const chapters = Array.from(document.querySelectorAll<HTMLElement>(".chapter"));
      const hero = document.querySelector<HTMLElement>(".hero");
      const about = document.querySelector<HTMLElement>(".about-section");
      const experience = document.querySelector<HTMLElement>(".experience-section");
      const now = document.querySelector<HTMLElement>(".now-section");
      const notes = document.querySelector<HTMLElement>(".notes-section");
      const contact = document.querySelector<HTMLElement>(".contact-section");

      root.dataset.motion = "enhanced";

      const revealGroups: Array<{ selector: string; kind: RevealKind; duration: number }> = [
        { selector: ".section-heading", kind: "heading", duration: motion.duration.section },
        { selector: ".project", kind: "project", duration: motion.duration.project },
        { selector: ".about-copy, .about-side, .now-copy", kind: "copy", duration: motion.duration.section },
        { selector: ".experiment-row, .experience-row, .note-row, .now-card li", kind: "row", duration: motion.duration.row },
        { selector: ".contact-inner", kind: "contact", duration: motion.duration.project },
      ];
      const revealTargets = revealGroups.flatMap((group) =>
        Array.from(document.querySelectorAll<HTMLElement>(group.selector)).map((element, index) => ({ ...group, element, index })),
      );

      const revealAnimations = new Map<HTMLElement, Animation>();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          const element = target as HTMLElement;
          const animation = revealAnimations.get(element);
          if (!animation) return;
          animation.play();
          animation.finished
            .then(() => {
              element.style.removeProperty("will-change");
              animation.cancel();
              revealAnimations.delete(element);
            })
            .catch(() => {});
          observer.unobserve(element);
        });
      }, { rootMargin: "0px 0px -7%", threshold: 0.08 });
      revealTargets.forEach(({ element, kind, index, duration }) => {
        element.style.willChange = "transform, opacity";
        const animation = element.animate(revealFrames(kind, index), {
          duration,
          easing: motion.easing,
          delay: (index % 3) * motion.stagger,
          fill: "both",
        });
        animation.pause();
        animation.currentTime = 0;
        animations.push(animation);
        revealAnimations.set(element, animation);
        observer.observe(element);
      });

      let frame = 0;
      const render = () => {
        frame = 0;
        const viewportHeight = innerHeight;
        const range = root.scrollHeight - viewportHeight;
        const pageProgress = range > 0 ? scrollY / range : 0;
        root.style.setProperty("--scroll-progress", String(pageProgress));
        root.style.setProperty("--scroll-progress-percent", `${pageProgress * 100}%`);

        if (hero) {
          const progress = clamp(scrollY / Math.max(hero.offsetHeight, 1));
          hero.style.setProperty("--hero-scroll", progress.toFixed(4));
          hero.style.setProperty("--hero-lift", `${progress * -110}px`);
          hero.style.setProperty("--hero-fade", String(1 - progress * 0.58));
          hero.style.setProperty("--hero-scale", String(1 - progress * 0.045));
          hero.style.setProperty("--hero-circle-y", `${progress * 70}px`);
          hero.style.setProperty("--hero-circle-turn", `${progress * 80}deg`);
          hero.style.setProperty("--hero-sticker-y", `${progress * -76}px`);
          hero.style.setProperty("--hero-sticker-turn", `${9 + progress * 18}deg`);
          hero.style.setProperty("--hero-spark-x", `${progress * 48}px`);
          hero.style.setProperty("--hero-spark-y", `${progress * -64}px`);
          hero.style.setProperty("--hero-spark-turn", `${progress * 120}deg`);
        }

        projects.forEach((project, index) => {
          const rect = project.getBoundingClientRect();
          if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;
          const progress = viewportProgress(project, viewportHeight);
          const centered = progress - 0.5;
          project.style.setProperty("--scene-shift", `${centered * -84}px`);
          project.style.setProperty("--scene-tilt", `${centered * (index % 2 === 0 ? -3.2 : 3.2)}deg`);
          project.style.setProperty("--copy-shift", `${centered * (index % 2 === 0 ? 42 : -42)}px`);
        });

        if (experiments) {
          const progress = viewportProgress(experiments, viewportHeight);
          experiments.style.setProperty("--experiments-progress", progress.toFixed(4));
          experiments.style.setProperty("--experiments-drift", `${(progress - 0.5) * -32}px`);
          experiments.style.setProperty("--sortify-record-turn", `${progress * -8}deg`);
        }
        experimentRows.forEach((row, index) => {
          const progress = viewportProgress(row, viewportHeight);
          const centered = progress - 0.5;
          const depth = centered * (index % 2 === 0 ? -24 : 24);
          row.style.setProperty("--experiment-layer-y", `${depth}px`);
          row.style.setProperty("--experiment-layer-far-y", `${depth * -0.56}px`);
          row.style.setProperty("--experiment-layer-mid-y", `${depth * -0.28}px`);
          row.style.setProperty("--experiment-layer-close-y", `${depth * -0.48}px`);
          row.style.setProperty("--experiment-grid-x", `${centered * (index % 2 === 0 ? -20 : 20)}px`);
        });

        chapters.forEach((chapter) => {
          const rect = chapter.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > viewportHeight) return;
          chapter.style.setProperty("--chapter-progress", viewportProgress(chapter, viewportHeight).toFixed(4));
        });
        if (about) {
          const progress = viewportProgress(about, viewportHeight);
          about.style.setProperty("--about-turn", `${progress * 26 - 13}deg`);
          about.style.setProperty("--about-shift", `${(progress - 0.5) * -90}px`);
          about.style.setProperty("--about-side-shift", `${(progress - 0.5) * 31.5}px`);
        }
        if (experience) experience.style.setProperty("--experience-shift", `${(viewportProgress(experience, viewportHeight) - 0.5) * -130}px`);
        if (now) {
          const progress = viewportProgress(now, viewportHeight);
          now.style.setProperty("--orbit-turn", `${progress * 150 - 45}deg`);
          now.style.setProperty("--orbit-shift", `${(progress - 0.5) * -120}px`);
        }
        if (notes) notes.style.setProperty("--notes-shift", `${(viewportProgress(notes, viewportHeight) - 0.5) * 62}px`);
        if (contact) contact.style.setProperty("--contact-lift", `${(1 - viewportProgress(contact, viewportHeight)) * 80}px`);
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
        delete root.dataset.motion;
        root.style.removeProperty("--scroll-progress");
        root.style.removeProperty("--scroll-progress-percent");
        revealTargets.forEach(({ element }) => element.style.removeProperty("will-change"));
        ["--hero-scroll", "--hero-lift", "--hero-fade", "--hero-scale", "--hero-circle-y", "--hero-circle-turn", "--hero-sticker-y", "--hero-sticker-turn", "--hero-spark-x", "--hero-spark-y", "--hero-spark-turn"]
          .forEach((property) => hero?.style.removeProperty(property));
        projects.forEach((project) => ["--scene-shift", "--scene-tilt", "--copy-shift"].forEach((property) => project.style.removeProperty(property)));
        ["--experiments-progress", "--experiments-drift", "--sortify-record-turn"].forEach((property) => experiments?.style.removeProperty(property));
        experimentRows.forEach((row) => ["--experiment-layer-y", "--experiment-layer-far-y", "--experiment-layer-mid-y", "--experiment-layer-close-y", "--experiment-grid-x"].forEach((property) => row.style.removeProperty(property)));
        chapters.forEach((chapter) => chapter.style.removeProperty("--chapter-progress"));
        ["--about-turn", "--about-shift", "--about-side-shift"].forEach((property) => about?.style.removeProperty(property));
        experience?.style.removeProperty("--experience-shift");
        ["--orbit-turn", "--orbit-shift"].forEach((property) => now?.style.removeProperty(property));
        notes?.style.removeProperty("--notes-shift");
        contact?.style.removeProperty("--contact-lift");
      };
    }

    configure();
    preference.addEventListener("change", configure);
    return () => { dispose(); preference.removeEventListener("change", configure); };
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><span /></div>;
}
