"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useSyncExternalStore, useState } from "react";
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
  return <ImageContent key={src} src={src} alt={alt} animated={animated} />;
}
function ImageContent({
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
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!failed || attempt >= 2) return;
    const timer = setTimeout(() => {
      setAttempt((value) => value + 1);
      setFailed(false);
    }, attempt === 0 ? 1000 : 3000);
    return () => clearTimeout(timer);
  }, [failed, attempt]);
  const imageSrc = animated && !playing ? `${src}&still=1` : src;
  return (
    <div className="article-image">
      {failed ? (
        attempt < 2 ? (
          <p className="media-failure" role="status">
            Retrying image…
          </p>
        ) : (
          <div className="media-failure">
            <p>Image unavailable.</p>
            <button
              type="button"
              onClick={() => {
                setAttempt(0);
                setFailed(false);
              }}
            >
              Retry image
            </button>
          </div>
        )
      ) : (
        <img
          key={`${playing}-${attempt}`}
          src={attempt ? `${imageSrc}&retry=${attempt}` : imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {animated && (
        <button
          type="button"
          aria-pressed={playing}
          onClick={() => {
            setRequested(!playing);
            setAttempt(0);
            setFailed(false);
          }}
        >
          {playing ? "Pause animation" : "Play animation"}
        </button>
      )}
    </div>
  );
}
