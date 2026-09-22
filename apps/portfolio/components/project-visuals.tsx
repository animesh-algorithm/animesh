import { ArrowDown, ArrowRight, ArrowUp, Check, Spark } from "./icons";

export function VisaFlowVisual() {
  return (
    <div
      className="visual visual-visa"
      aria-label="VisaFile reviews DS-160 answers, enters them on the CEAC website, and pauses when CEAC needs the applicant"
      role="img"
    >
      <div className="visa-scene" aria-hidden="true">
        <section className="visa-app-window">
          <header className="visa-app-header">
            <span className="visa-app-mark">V</span>
            <strong>VisaFile</strong>
            <small>DS-160</small>
          </header>
          <div className="visa-app-body">
            <span className="visa-kicker">REVIEW COMPLETE</span>
            <h3>Answers reviewed</h3>
            <ul className="visa-review-list">
              <li>
                <i>
                  <Check />
                </i>
                <span>
                  <strong>Personal</strong>
                  <small>Identity and contact</small>
                </span>
              </li>
              <li>
                <i>
                  <Check />
                </i>
                <span>
                  <strong>Travel</strong>
                  <small>Trip and companions</small>
                </span>
              </li>
              <li>
                <i>
                  <Check />
                </i>
                <span>
                  <strong>Work &amp; education</strong>
                  <small>History checked</small>
                </span>
              </li>
            </ul>
            <div className="visa-ready-state">
              <span>
                <i /> Ready for automation
              </span>
              <ArrowRight />
            </div>
          </div>
        </section>

        <div className="visa-route">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M4 86 C40 86 40 18 96 18" />
          </svg>
          <span className="visa-route-dot" />
        </div>

        <section className="ceac-window">
          <header className="ceac-header">
            <span>
              <i /> CEAC website
            </span>
            <small>Official form</small>
          </header>
          <div className="ceac-body">
            <span className="ceac-status">
              <i /> Entering reviewed answers
            </span>
            <div className="ceac-form-line is-long" />
            <div className="ceac-form-line" />
            <div className="ceac-form-line is-short" />
            <div className="ceac-progress">
              <span />
            </div>
          </div>
        </section>

        <aside className="visa-checkpoint">
          <span className="visa-checkpoint-icon">!</span>
          <div>
            <small>HUMAN CHECKPOINT</small>
            <strong>CEAC needs you</strong>
            <p>CAPTCHA or correction</p>
            <span>
              Resume same session <ArrowRight />
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function StudioVisual() {
  return (
    <div
      className="visual visual-studio"
      aria-label="Abstract interface preview for the AI insurance concierge"
      role="img"
    >
      <div className="studio-orbit orbit-one" />
      <div className="studio-orbit orbit-two" />
      <div className="studio-center">
        <Spark className="studio-spark" />
        <strong>
          Context in,
          <br />
          reply out.
        </strong>
      </div>
      <div className="floating-chip chip-one">
        <i /> Customer
      </div>
      <div className="floating-chip chip-two">
        <i /> Plan
      </div>
      <div className="floating-chip chip-three">
        <i /> Conversation
      </div>
      <span className="coordinate coordinate-a">12° 14′</span>
      <span className="coordinate coordinate-b">CONCIERGE 01</span>
    </div>
  );
}

export function DataVisual() {
  return (
    <div
      className="visual visual-data"
      aria-label="Gradly Links turns long URLs into branded links while saving about 400 dollars a month"
      role="img"
    >
      <div className="links-glow links-glow-one" aria-hidden="true" />
      <div className="links-glow links-glow-two" aria-hidden="true" />
      <div className="links-header" aria-hidden="true">
        <span className="links-mark">G</span>
        <span>Gradly Links</span>
      </div>
      <div className="links-workflow" aria-hidden="true">
        <div className="links-step links-source">
          <small>DESTINATION</small>
          <span>https://</span>
          <b>Paste a long URL…</b>
        </div>
        <span className="links-connector"><ArrowDown /></span>
        <div className="links-step links-result">
          <small>BRANDED LINK</small>
          <span>
            <strong>link.gradly.us</strong>
            <b>/whatever</b>
          </span>
          <i>Copy</i>
        </div>
      </div>
      <div className="links-footer" aria-hidden="true">
        <div>
          <small>REPLACES</small>
          <strong>Rebrandly</strong>
        </div>
        <div className="links-savings">
          <small>EST. SAVINGS</small>
          <strong>
            $400<span>/mo</span>
          </strong>
        </div>
      </div>
    </div>
  );
}

export function ClaimsVisual() {
  return (
    <div
      className="visual visual-claims"
      aria-label="A simple reimbursement app that turns a medical bill into an ACH payment"
      role="img"
    >
      <div className="claims-ambient claims-ambient-one" aria-hidden="true" />
      <div className="claims-ambient claims-ambient-two" aria-hidden="true" />

      <div className="claims-app" aria-hidden="true">
        <div className="claims-app-bar">
          <strong>Reimbursement</strong>
          <span>
            <i /> Secure
          </span>
        </div>
        <div className="claims-app-body">
          <section className="claims-intake">
            <span className="claims-eyebrow">NEW REQUEST</span>
            <h4>Send us your bill.</h4>
            <p>We’ll take it from here.</p>

            <div className="claims-upload">
              <span className="claims-upload-icon"><ArrowUp /></span>
              <div>
                <strong>Medical bill</strong>
                <small>PDF uploaded</small>
              </div>
              <b>Ready</b>
            </div>
            <div className="claims-bank">
              <span>Bank details</span>
              <strong>Added securely</strong>
            </div>
            <div className="claims-submit">
              Submit for review <ArrowRight />
            </div>
          </section>

          <aside className="claims-journey">
            <span className="claims-eyebrow">WORKING IN THE BACKGROUND</span>
            <ol>
              <li className="is-complete">
                <i><Check /></i>
                <span>
                  <b>Bill analyzed</b>
                  <small>Details captured</small>
                </span>
              </li>
              <li className="is-complete">
                <i><Check /></i>
                <span>
                  <b>Eligibility checked</b>
                  <small>Reimbursement approved</small>
                </span>
              </li>
              <li className="is-current">
                <i>3</i>
                <span>
                  <b>ACH initiated</b>
                  <small>Payment is on its way</small>
                </span>
              </li>
            </ol>
          </aside>
        </div>
      </div>

      <div className="claims-payout" aria-hidden="true">
        <span className="claims-payout-check"><Check /></span>
        <div>
          <small>PAYMENT INITIATED</small>
          <strong>On the way.</strong>
          <p>Arrives in 1–2 business days.</p>
          <span className="claims-email">
            <i /> Email confirmation sent
          </span>
        </div>
      </div>
    </div>
  );
}
