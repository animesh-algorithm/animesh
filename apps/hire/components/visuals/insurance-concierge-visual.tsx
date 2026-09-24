"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SparkIcon } from "./illustration-icons";

const answer =
  "Hi Hal, your Gradly Supreme Plus coverage ended on August 15, 2026. You can view your insurance card at link.gradly.us/card-123.";

export function InsuranceConciergeVisual() {
  const figureRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [phase, setPhase] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setHasEntered(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        setPhase(3);
        setCharacters(answer.length);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timers = [
      window.setTimeout(() => setPhase(1), 900),
      window.setTimeout(() => setPhase(2), 1900),
      window.setTimeout(() => setPhase(3), 2900),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [hasEntered, replay]);

  useEffect(() => {
    if (phase !== 3 || characters >= answer.length) return;
    const timer = window.setTimeout(
      () => setCharacters((count) => Math.min(count + 2, answer.length)),
      28,
    );
    return () => window.clearTimeout(timer);
  }, [phase, characters]);

  const restart = () => {
    setPhase(0);
    setCharacters(0);
    setReplay((count) => count + 1);
  };

  return (
    <figure className="concierge-demo" ref={figureRef}>
      <div className="concierge-demo__window">
        <div className="concierge-demo__browser">
          <span className="concierge-demo__traffic" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Gradly member portal</span>
        </div>
        <div className="concierge-demo__app">
          <header className="concierge-demo__dashboard-header">
            <Image
              className="concierge-demo__brand"
              src="/images/gradly.svg"
              alt="Gradly"
              width={109}
              height={66}
            />
            <span className="concierge-demo__support">Support</span>
            <span
              className="concierge-demo__profile"
              aria-label="Example member Hal Jordan"
            >
              HJ
            </span>
          </header>
          <div className="concierge-demo__dashboard-layout">
            <div className="concierge-demo__dashboard-main">
              <div className="concierge-demo__dashboard-top">
                <section
                  className="concierge-demo__coverage"
                  aria-label="Example coverage summary"
                >
                  <div>
                    <small>Your coverage status</small>
                    <span>Not Active</span>
                  </div>
                  <strong>Your coverage ended</strong>
                  <p>Your Gradly Supreme Plus plan ended August 15, 2026.</p>
                  <span className="concierge-demo__coverage-action">
                    Renew your plan
                  </span>
                </section>
                <section
                  className="concierge-demo__card"
                  aria-label="Example plan card"
                >
                  <strong className="concierge-demo__card-title">
                    Gradly Supreme Plus
                  </strong>
                  <dl className="concierge-demo__card-details">
                    <div>
                      <dt>Deductible</dt>
                      <dd>$0</dd>
                    </div>
                    <div>
                      <dt>Coinsurance</dt>
                      <dd>100%</dd>
                    </div>
                    <div>
                      <dt>OOP max</dt>
                      <dd>$5,000</dd>
                    </div>
                    <div>
                      <dt>Valid till</dt>
                      <dd>Aug 15, 2026</dd>
                    </div>
                  </dl>
                </section>
                <section
                  className="concierge-demo__quick-links"
                  aria-label="Quick links"
                >
                  <strong>Quick links</strong>
                  <div>
                    <span>Virtual care</span>
                    <span>Medications</span>
                    <span>Find providers</span>
                  </div>
                </section>
              </div>
              <div className="concierge-demo__dashboard-bottom">
                <div className="concierge-demo__portal">
                  <Image
                    src="/images/gradly-member.jpg"
                    alt="Gradly member portal with provider search, claims, waiver help, and plan renewal tools"
                    width={1400}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="concierge-demo__documents">
                  <strong>Download Plan documents</strong>
                  <div>
                    <span>Insurance card</span>
                    <span>Summary of Benefits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {chatOpen ? (
            <div className="concierge-demo__chat">
              <div className="concierge-demo__chat-head">
                <span className="concierge-demo__chat-icon" aria-hidden="true">
                  <SparkIcon />
                </span>
                <div>
                  <strong>Insurance Concierge</strong>
                  <small>Ask a question about your plan</small>
                </div>
                <button
                  type="button"
                  onClick={restart}
                  aria-label="Replay example conversation"
                >
                  ↻
                </button>
              </div>
              <div className="concierge-demo__messages">
                <p className="concierge-demo__question">
                  When does my coverage end?
                </p>
                <div className="concierge-demo__reply">
                  <span
                    className="concierge-demo__assistant"
                    aria-hidden="true"
                  >
                    <SparkIcon />
                  </span>
                  <div>
                    {phase < 3 ? (
                      <p className="concierge-demo__thinking" role="status">
                        {phase === 0
                          ? "Checking your plan"
                          : phase === 1
                            ? "Finding your coverage dates"
                            : "Putting your answer together"}
                        <span aria-hidden="true">…</span>
                      </p>
                    ) : (
                      <p aria-label={answer}>
                        {answer.slice(0, characters)}
                        <span
                          className="concierge-demo__cursor"
                          aria-hidden="true"
                        />
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="concierge-demo__input">
                Ask about your coverage <span aria-hidden="true">↑</span>
              </div>
            </div>
          ) : null}
          <button
            className="concierge-demo__toggle"
            type="button"
            aria-label={
              chatOpen
                ? "Close insurance concierge"
                : "Open insurance concierge"
            }
            aria-expanded={chatOpen}
            onClick={() => setChatOpen((open) => !open)}
          >
            {chatOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 5h16v12H9l-5 3V5Z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </figure>
  );
}
