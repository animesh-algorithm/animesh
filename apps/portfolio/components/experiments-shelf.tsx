import type { ProfileExperiment } from "@/content/profile";
import { ArrowUpRight, Demo, GitHub } from "./icons";

function SortifyExperimentVisual() {
  return (
    <div
      className="experiment-visual experiment-visual-sortify"
      role="img"
      aria-label="A record beside a stack of suggested playlists"
    >
      <span className="experiment-grid" aria-hidden="true" />
      <span className="sortify-record" aria-hidden="true">
        <i />
      </span>
      <div className="sortify-playlists" aria-hidden="true">
        <span>late night</span>
        <span>soft replay</span>
        <span>old favorites</span>
      </div>
      <span className="experiment-brand sortify-brand" aria-hidden="true">
        <svg viewBox="0 0 24 26" fill="none">
          <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
        </svg>
        <strong>sortify</strong>
      </span>
    </div>
  );
}

function CrateExperimentVisual() {
  return (
    <div
      className="experiment-visual experiment-visual-crate"
      role="img"
      aria-label="Saved photos being organized into a private collection"
    >
      <span className="experiment-grid" aria-hidden="true" />
      <span className="crate-note" aria-hidden="true">
        KEEP THIS
      </span>
      <div className="crate-photo crate-photo-one" aria-hidden="true">
        <i />
      </div>
      <div className="crate-photo crate-photo-two" aria-hidden="true">
        <i />
      </div>
      <span className="crate-collection" aria-hidden="true">
        collection / 08
      </span>
      <span className="experiment-brand crate-brand" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M17 22h30v25H17zm0 8h30M26 22v25m12-25v25" />
          <path d="m21 17 7-6 7 6" />
        </svg>
        <strong>Crate</strong>
      </span>
    </div>
  );
}

const experimentVisuals = {
  sortify: SortifyExperimentVisual,
  crate: CrateExperimentVisual,
} as const;

export function ExperimentsShelf({
  experiments,
}: {
  experiments: readonly ProfileExperiment[];
}) {
  return (
    <section className="experiments-shelf" aria-labelledby="experiments-title">
      <div className="experiments-divider" aria-hidden="true">
        <svg viewBox="0 0 900 58" preserveAspectRatio="none">
          <path d="M3 39C119 8 229 52 351 31C481 8 591 8 711 28C778 39 835 40 897 24" />
          <path d="M727 30C786 42 839 41 897 25" />
          <circle cx="706" cy="27" r="4" />
        </svg>
      </div>
      <header className="experiments-heading">
        <div>
          <span className="project-label">Also shipping</span>
          <h3 id="experiments-title">Experiments</h3>
        </div>
        <p>Side projects that started as an itch and became real products.</p>
      </header>

      <div className="experiments-list">
        {experiments.map((experiment, index) => {
          const Visual = experimentVisuals[experiment.id];

          return (
            <article className="experiment-row" key={experiment.id}>
              <span className="experiment-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Visual />
              <div className="experiment-copy">
                <span className="experiment-name">{experiment.name}</span>
                <h4>{experiment.title}</h4>
                <p>{experiment.description}</p>
                <span className="experiment-meta">{experiment.meta}</span>
              </div>
              <div
                className="experiment-links"
                aria-label={`${experiment.name} links`}
              >
                {experiment.links.map((link) => (
                  <a
                    aria-label={`${link.label}: ${experiment.name}`}
                    data-analytics-event="project_link_clicked"
                    data-analytics-placement="work"
                    data-analytics-project={experiment.id}
                    data-analytics-category={
                      link.icon === "github" ? "source" : "demo"
                    }
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={link.href}
                  >
                    {link.icon === "demo" ? <Demo /> : <GitHub />}
                    <span>{link.label}</span>
                    <ArrowUpRight className="experiment-link-arrow" />
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
