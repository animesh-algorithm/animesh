"use client";

import { useState } from "react";

type WorkbenchStage = "inputs" | "build" | "shipped";

const stages: readonly {
  id: WorkbenchStage;
  index: string;
  label: string;
  annotation: string;
}[] = [
  {
    id: "inputs",
    index: "01",
    label: "Inputs",
    annotation: "Scattered work hides in inboxes, sheets, and manual handoffs.",
  },
  {
    id: "build",
    index: "02",
    label: "Build",
    annotation: "I map the workflow, design the product, and connect the moving parts.",
  },
  {
    id: "shipped",
    index: "03",
    label: "Shipped",
    annotation: "Your team gets one working system, not another workaround.",
  },
];

export function BuilderWorkbench() {
  const [activeStage, setActiveStage] = useState<WorkbenchStage>("inputs");
  const annotation = stages.find((stage) => stage.id === activeStage)?.annotation ?? stages[0].annotation;

  return (
    <figure
      className="builder-workbench"
      data-reveal
      data-stage={activeStage}
      aria-label="A builder workbench that turns scattered operational work into a shipped product"
    >
      <div className="workbench-scene" aria-hidden="true">
        <svg className="workbench-route" viewBox="0 0 680 240" preserveAspectRatio="none">
          <path d="M104 126C168 34 230 205 314 119C375 57 429 156 548 112" />
          <circle cx="104" cy="126" r="7" />
          <circle cx="314" cy="119" r="7" />
          <circle cx="548" cy="112" r="7" />
        </svg>

        <section className="workbench-region workbench-region--inputs">
          <span className="workbench-region__label">Scattered inputs</span>
          <div className="input-fragment input-fragment--email">
            <span className="input-fragment__icon">@</span>
            <span><b>Inbox</b><small>Can you update this?</small></span>
          </div>
          <div className="input-fragment input-fragment--sheet">
            <strong>TRACKER_V7</strong>
            <span className="mini-sheet"><i /><i /><i /><i /><i /><i /></span>
          </div>
          <div className="input-fragment input-fragment--handoff">
            <small>Handoff</small>
            <strong>Who owns this?</strong>
          </div>
        </section>

        <section className="workbench-region workbench-region--build">
          <span className="workbench-tape">BUILD BENCH</span>
          <div className="build-board">
            <div className="build-board__header">
              <strong>System map</strong>
              <span>In progress</span>
            </div>
            <div className="build-board__map">
              <span className="build-node build-node--workflow">Workflow</span>
              <svg viewBox="0 0 70 34"><path d="M2 18C20 2 42 33 68 15" /></svg>
              <span className="build-node build-node--rules">Rules</span>
              <span className="build-node build-node--product">Product</span>
            </div>
            <div className="build-board__notes">
              <span>Human check</span>
              <span>Automation</span>
              <span>Clear owner</span>
            </div>
          </div>
        </section>

        <section className="workbench-region workbench-region--shipped">
          <span className="workbench-region__label">One working product</span>
          <div className="shipped-product">
            <div className="shipped-product__chrome">
              <span><i /><i /><i /></span>
              <small>OPERATIONS</small>
            </div>
            <div className="shipped-product__body">
              <span className="shipped-product__status">Live workflow</span>
              <strong>Everything in one place.</strong>
              <div className="product-row"><i>1</i><span><b>Request received</b><small>Owner assigned</small></span><em>Done</em></div>
              <div className="product-row"><i>2</i><span><b>Rules checked</b><small>Ready to review</small></span><em>Done</em></div>
              <div className="product-row product-row--active"><i>3</i><span><b>Ship the outcome</b><small>Clear next action</small></span><em>Ready</em></div>
            </div>
          </div>
          <span className="shipped-stamp">SHIPPED</span>
        </section>
      </div>

      <div className="workbench-controls" aria-label="Inspect the workbench stages">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            aria-controls="workbench-annotation"
            aria-pressed={activeStage === stage.id}
            onClick={() => setActiveStage(stage.id)}
          >
            <span>{stage.index}</span>
            {stage.label}
          </button>
        ))}
      </div>

      <figcaption id="workbench-annotation" aria-live="polite" aria-atomic="true">
        {annotation}
      </figcaption>
    </figure>
  );
}
