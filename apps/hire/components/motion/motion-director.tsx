"use client";

import { useEffect } from "react";

export function MotionDirector() {
  useEffect(() => {
    const root = document.documentElement;
    const handleVisibility = () => root.classList.toggle("is-tab-hidden", document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      root.classList.remove("is-tab-hidden");
    };
  }, []);

  return null;
}
