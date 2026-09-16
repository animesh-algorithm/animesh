"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

function FaqRow({ faq, index }: { faq: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-answer-${index + 1}`;

  return (
    <div className="faq-item" data-open={open} data-reveal>
      <button
        aria-controls={answerId}
        aria-expanded={open}
        className="faq-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>0{index + 1}</span>
        <span>{faq.question}</span>
        <i aria-hidden="true">+</i>
      </button>
      <div aria-hidden={!open} className="faq-answer" id={answerId}>
        <div className="faq-answer__inner">
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="faq-list">
      {items.map((faq, index) => (
        <FaqRow faq={faq} index={index} key={faq.question} />
      ))}
    </div>
  );
}
