import type { CSSProperties } from "react";

interface ProjectVisualProps {
  project: "visafile" | "ai-insurance-concierge" | "gradly-links" | "ai-claims-adjudication";
}

interface FlowConnectorProps {
  className?: string;
  label?: string;
}

function FlowConnector({ className = "", label }: FlowConnectorProps) {
  return (
    <div className={`architecture-connector ${className}`.trim()} aria-hidden="true">
      {label ? <span>{label}</span> : null}
      <svg viewBox="0 0 84 30" preserveAspectRatio="none">
        <path d="M3 17C18 3 29 28 44 16C56 6 66 8 80 15" />
        <circle cx="80" cy="15" r="2.8" />
      </svg>
    </div>
  );
}

function VisaFileVisual() {
  return (
    <div className="project-scene visa-architecture">
      <div className="architecture-titlebar"><span>VisaFile application run</span><span className="scene-status">Human in the loop</span></div>
      <div className="visa-architecture__flow">
        <div className="architecture-node architecture-node--paper"><small>01 · Web app</small><strong>Guided DS-160 intake</strong><span>Reviewed answers</span></div>
        <FlowConnector label="save" />
        <div className="architecture-node architecture-node--database"><small>02 · Source of truth</small><strong>Supabase</strong><span>Application + state</span></div>
        <FlowConnector label="job" />
        <div className="architecture-node architecture-node--worker"><small>03 · Worker</small><strong>Puppeteer + Chromium</strong><span>Fills the official form</span></div>
        <FlowConnector label="CEAC" />
        <div className="architecture-node architecture-node--official"><small>04 · Official site</small><strong>DS-160</strong><span>Progress is persisted</span></div>
      </div>
      <div className="human-gate"><span className="human-gate__pulse" aria-hidden="true" /><div><small>Automation pauses here</small><strong>Browser check · CAPTCHA · corrections</strong></div><span>Resume same session</span></div>
    </div>
  );
}

function ConciergeVisual() {
  const sources = [["Customer", "profile + history"], ["Journey", "current stage"], ["Insurance plan", "coverage context"], ["Conversation", "full thread"]] as const;
  return (
    <div className="project-scene concierge-architecture">
      <div className="architecture-titlebar"><span>AI Insurance Concierge</span><span>Context before copy</span></div>
      <div className="concierge-architecture__body">
        <div className="context-stack">
          {sources.map(([title, detail], index) => <div className="context-source" key={title} style={{ "--source-index": index } as CSSProperties}><span>0{index + 1}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}
        </div>
        <div className="context-composer" aria-hidden="true"><FlowConnector className="context-connector context-connector--in" label="retrieve" /><b>Context<br />assembly</b><FlowConnector className="context-connector context-connector--out" label="draft" /></div>
        <div className="reply-workspace"><div className="reply-workspace__header"><span>Support reply</span><span>Draft</span></div><strong>Answer the situation,<br />not just the message.</strong><i /><i /><i /><div className="reply-evidence"><span>customer</span><span>plan</span><span>thread</span></div></div>
      </div>
    </div>
  );
}

function GradlyVisual() {
  return (
    <div className="project-scene gradly-architecture">
      <div className="architecture-titlebar"><span>Gradly Links</span><span>Internal short-link manager</span></div>
      <div className="link-builder"><div className="link-builder__field"><small>Destination</small><span>https://gradly.us/resources/...</span></div><div className="link-builder__field link-builder__field--slug"><small>Branded link</small><strong>link.gradly.us/<b>reimbursement-guide</b></strong></div><span className="link-builder__button">Create link</span></div>
      <div className="link-resolver" aria-label="A branded short link resolving to its destination"><div><small>Shared</small><strong>link.gradly.us/<br />usc-waiver-guide</strong></div><FlowConnector label="resolve" /><div className="resolver-core"><span>G</span><strong>Gradly redirect</strong><small>custom domain</small></div><FlowConnector label="send" /><div><small>Destination</small><strong>Guide opens</strong><span>Tracked + manageable</span></div></div>
      <div className="link-ledger"><span>Also in use</span><b>link.gradly.us/book-a-call</b><strong>≈ $400/mo saved</strong></div>
    </div>
  );
}

function ClaimsVisual() {
  return (
    <div className="project-scene claims-architecture">
      <div className="architecture-titlebar"><span>Reimbursement request</span><span className="scene-status">Secure flow</span></div>
      <div className="claims-architecture__body">
        <div className="claim-intake"><small>New request</small><strong>Medical bill</strong><div className="claim-file"><span>PDF</span><div><b>bill.pdf</b><small>Uploaded</small></div><i>Ready</i></div><div className="claim-bank"><span>Bank details</span><b>Added securely</b></div></div>
        <FlowConnector className="claim-stage-connector" label="check" />
        <div className="claim-engine"><small>Adjudication</small><ol><li><i>1</i><span><b>Bill details</b><small>captured</small></span></li><li><i>2</i><span><b>Eligibility</b><small>checked</small></span></li><li><i>3</i><span><b>Reimbursement</b><small>approved</small></span></li></ol></div>
        <div className="claim-payout">
          <svg className="claim-payout__route" viewBox="0 0 640 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-20 92C92 18 148 118 248 54S418 12 520 68S610 72 674 22" />
            <path d="M-30 34C76 104 150 8 250 74S410 118 522 42S618 8 674 58" />
          </svg>
          <div className="claim-payout__copy"><span>ACH initiated</span><strong>Payment on the way</strong></div>
          <div className="claim-payout__meta"><b>1–2 business days</b><small>Email confirmation sent</small></div>
        </div>
      </div>
    </div>
  );
}

export function ProjectVisual({ project }: ProjectVisualProps) {
  const labels = { visafile: "VisaFile architecture from guided intake through persisted state and a browser worker to CEAC, with human checkpoints", "ai-insurance-concierge": "Customer, journey, insurance plan, and conversation context assembled before an AI support reply is drafted", "gradly-links": "Gradly Links creating and resolving branded link.gradly.us short links", "ai-claims-adjudication": "A medical bill and bank details moving through eligibility, reimbursement, ACH payment, and email confirmation" } as const;
  return <div className={`project-visual project-visual--${project}`} aria-label={labels[project]} role="img" data-reveal>{project === "visafile" ? <VisaFileVisual /> : null}{project === "ai-insurance-concierge" ? <ConciergeVisual /> : null}{project === "gradly-links" ? <GradlyVisual /> : null}{project === "ai-claims-adjudication" ? <ClaimsVisual /> : null}</div>;
}
