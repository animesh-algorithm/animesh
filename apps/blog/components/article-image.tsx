"use client";
/* eslint-disable @next/next/no-img-element */
import { useSyncExternalStore, useState } from "react";
const subscribe = (onChange: () => void) => {
  const m = matchMedia("(prefers-reduced-motion: reduce)");
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
};
export function ArticleImage({
  src,
  alt,
  animated,
}: {
  src: string;
  alt: string;
  animated: boolean;
}) {
  const reduced = useSyncExternalStore(
    subscribe,
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [requested, setRequested] = useState<boolean | null>(null);
  const playing = animated && (requested ?? !reduced);
  const [failed, setFailed] = useState(false);
  return (
    <div className="article-image">
      {failed ? (
        <p className="media-failure">Image unavailable.</p>
      ) : (
        <img
          key={`${playing}`}
          src={animated && !playing ? `${src}&still=1` : src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      {animated && (
        <button
          type="button"
          aria-pressed={playing}
          onClick={() => {
            setRequested(!playing);
            setFailed(false);
          }}
        >
          {playing ? "Pause animation" : "Play animation"}
        </button>
      )}
    </div>
  );
}
