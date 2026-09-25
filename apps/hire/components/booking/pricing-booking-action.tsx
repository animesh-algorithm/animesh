"use client";

import { useRef, useState } from "react";

interface PricingBookingActionProps {
  label: string;
  engagement: string;
  featured: boolean;
  embedHref: string | null;
  fallbackHref: string;
  inquiryHref: string;
}

export function PricingBookingAction({ label, engagement, featured, embedHref, fallbackHref, inquiryHref }: PricingBookingActionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const buttonClass = featured ? "button button--light" : "button button--ink";
  const content = <>{label} <span aria-hidden="true">→</span></>;

  if (!embedHref) {
    return <a className={buttonClass} href={fallbackHref} aria-label={`${label} — ${engagement}`}>{content}</a>;
  }

  return <>
    <button className={buttonClass} type="button" aria-label={`${label} — ${engagement}, book a call`} onClick={() => { setOpen(true); dialogRef.current?.showModal(); }}>{content}</button>
    <dialog className="pricing-booking-dialog" ref={dialogRef} aria-label={`Book a call about ${engagement}`} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
      <div className="pricing-booking-dialog__content" data-private>
        <div className="pricing-booking-dialog__header">
          <div><p className="section-kicker">Start with a conversation</p><h2>Book a call.</h2><p>Let’s talk through {engagement.toLowerCase()} and find the right scope.</p></div>
          <button className="pricing-booking-dialog__close" type="button" aria-label="Close booking dialog" onClick={() => dialogRef.current?.close()}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="M4 4l12 12M16 4 4 16" /></svg></button>
        </div>
        {open && <iframe allow="payment; fullscreen" src={embedHref} title="Book a call with Animesh using Cal.com" />}
        <div className="pricing-booking-dialog__links"><a href={embedHref} target="_blank" rel="noopener noreferrer">Open calendar in a new tab</a><a href={inquiryHref} onClick={() => dialogRef.current?.close()}>Prefer to write? Send a brief</a></div>
      </div>
    </dialog>
  </>;
}
