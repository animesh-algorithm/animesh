"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, MailIcon } from "./illustration-icons";

const steps = [
  "Processing",
  "Bill received",
  "Analyzing the bill",
  "Checking member details",
  "Reviewing claims eligibility",
  "Verifying account information",
  "Processing ACH",
  "Claim processed",
];

function ClaimProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const advance = () => {
      if (document.hidden) return;
      setActiveStep((current) => current < steps.length ? current + 1 : 0);
    };
    const schedule = () => {
      timer = setTimeout(() => {
        advance();
        schedule();
      }, activeStep === steps.length ? 3000 : 1200);
    };
    schedule();
    const resume = () => {
      if (document.hidden) clearTimeout(timer);
      else { clearTimeout(timer); schedule(); }
    };
    document.addEventListener("visibilitychange", resume);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", resume); };
  }, [activeStep, reduceMotion]);

  const visibleStep = reduceMotion ? steps.length : activeStep;

  return (
    <div className="claims-process">
      <div className="claims-process__header">
        <span className="claims-process__dots" aria-hidden="true"><i /><i /><i /></span>
        <span>claim-review / live</span>
        <span aria-hidden="true" />
      </div>
      <div className="claims-process__body">
        <span className="claims-process__eyebrow">AUTOMATED CLAIM REVIEW</span>
        <h3>Working on your claim<span className="claims-process__ellipsis" aria-hidden="true">…</span></h3>
        <ol aria-label="Claim review stages">
          {steps.slice(0, visibleStep + (visibleStep < steps.length ? 1 : 0)).map((step, index) => {
            const complete = index < visibleStep;
            return (
              <li key={step} className={complete ? "is-complete" : "is-active"}>
                <span className="claims-process__step">{String(index + 1).padStart(2, "0")}</span>
                <span>{step}</span>
                <span className="claims-process__indicator" aria-label={complete ? "Complete" : "In progress"}>
                  {complete ? <CheckIcon /> : <span className="claims-process__spinner" aria-hidden="true" />}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="claims-process__footer">
          <span className="claims-process__pulse" aria-hidden="true" />
          {visibleStep === steps.length ? "Claim review complete" : "Secure workflow in progress"}
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="claims-phone" aria-label={label}>
      <div className="claims-phone__island" aria-hidden="true" />
      <div className="claims-phone__status">
        <span>9:41</span>
        <span className="claims-phone__system-icons" aria-hidden="true">
          <svg viewBox="0 0 38 14" fill="none">
            <path d="M1 12V9h2v3zm4 0V7h2v5zm4 0V5h2v7zm4 0V2h2v10z" fill="currentColor" />
            <path d="M19 5c2.5-2.5 6.5-2.5 9 0m-7 2.5c1.5-1.5 4-1.5 5.5 0M24 10h.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="31" y="3" width="5" height="9" rx="1.5" stroke="currentColor" />
            <rect x="32" y="4" width="3" height="7" rx=".5" fill="currentColor" />
            <path d="M37 6v3" stroke="currentColor" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      {children}
      <div className="claims-phone__home" aria-hidden="true" />
    </div>
  );
}

export function ClaimsAdjudicationVisual() {
  const frameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneSize, setSceneSize] = useState({ scale: 1, height: 0 });

  useEffect(() => {
    const frame = frameRef.current;
    const scene = sceneRef.current;
    if (!frame || !scene) return;

    const resize = () => {
      const scale = Math.min(1, frame.clientWidth / scene.offsetWidth);
      const height = scene.offsetHeight * scale;
      setSceneSize((current) => current.scale === scale && current.height === height
        ? current
        : { scale, height });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    observer.observe(scene);
    resize();
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      className="claims-visual"
      aria-label="Illustrative claim journey from bill upload and bank details through automated review to reimbursement confirmation"
    >
      <div className="claims-visual__topline">
        <span>CLAIM JOURNEY</span>
        <span>ILLUSTRATIVE UI</span>
      </div>
      <div className="claims-visual__frame" ref={frameRef} style={sceneSize.height ? { height: sceneSize.height } : undefined}>
      <div className="claims-visual__scene" ref={sceneRef} role="region" aria-label="Three-step claim journey" tabIndex={0} style={{ transform: `scale(${sceneSize.scale})` }}>
        <div className="claims-visual__station">
          <PhoneFrame label="File a claim screen">
            <div className="claims-phone__app">
              <span aria-hidden="true">←</span>
              <strong>File a Claim</strong>
              <span aria-hidden="true" />
            </div>
            <div className="claims-phone__content">
              <span className="claims-phone__eyebrow">YOUR HEALTH COVERAGE</span>
              <h3>Submit a claim</h3>
              <p>
                Upload your medical bill and add your bank details for reimbursement.
              </p>
              <div className="claims-upload">
                <span className="claims-upload__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M7 3.5h7l4 4V20H7V3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M14 3.5V8h4M10 13h5M10 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                </span>
                <strong>medical-bill.pdf</strong>
                <small>Bill uploaded <CheckIcon /></small>
              </div>
              <span className="claims-fields-title">BANK DETAILS</span>
              <div className="claims-field">
                <span>Account holder</span>
                <strong>Hal Jordan</strong>
              </div>
              <div className="claims-field">
                <span>Routing number</span>
                <strong>•••••• 021</strong>
              </div>
              <div className="claims-field">
                <span>Account number</span>
                <strong>•••• 4829</strong>
              </div>
              <div className="claims-phone__button">
                Submit claim <span aria-hidden="true">→</span>
              </div>
            </div>
          </PhoneFrame>
          <span className="claims-visual__caption">01 / MEMBER SUBMITS</span>
        </div>
        <div className="claims-visual__station claims-visual__station--process">
          <ClaimProcess />
          <span className="claims-visual__caption">02 / SYSTEM REVIEWS</span>
        </div>
        <div className="claims-visual__station">
          <PhoneFrame label="Claim processed confirmation screen">
            <div className="claims-phone__app">
              <span aria-hidden="true">←</span>
              <strong>Claim Status</strong>
              <span aria-hidden="true" />
            </div>
            <div className="claims-phone__content claims-phone__content--success">
              <div className="claims-success-icon" aria-hidden="true">
                <CheckIcon />
              </div>
              <span className="claims-phone__eyebrow">CLAIM COMPLETE</span>
              <h3>Claim processed.</h3>
              <p>Your reimbursement is on its way.</p>
              <div className="claims-receipt">
                <span>REQUESTED AMOUNT</span>
                <strong>$88.58</strong>
                <div>
                  <span>Processed in</span>
                  <b>12 seconds</b>
                </div>
                <div>
                  <span>Payment method</span>
                  <b>ACH ···· 4829</b>
                </div>
              </div>
              <div className="claims-email">
                <MailIcon />
                <span>
                  A payment tracking receipt has been sent to your email.
                </span>
              </div>
              <small>Funds typically arrive in 1–2 business days.</small>
            </div>
          </PhoneFrame>
          <span className="claims-visual__caption">03 / MEMBER CONFIRMED</span>
        </div>
      </div>
      </div>
      <p className="claims-visual__hint">Swipe or scroll through the claim journey</p>
    </figure>
  );
}
