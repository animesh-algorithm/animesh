"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const headlines = site.hero.headings;

export function HeroHeadline() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setHeadlineIndex(Math.floor(Math.random() * headlines.length));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const headline = headlines[headlineIndex];
  return <h1 aria-label={headline.join(" ")}>{headline.map((line) => <span className="hero-headline-line" key={line} aria-hidden="true">{line}</span>)}</h1>;
}
