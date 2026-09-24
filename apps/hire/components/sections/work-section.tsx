import { experiments, projects } from "@/content/projects";
import { VisaFileProductImage } from "@/components/visuals/visafile-product-image";
import { GradlyMobileVisual } from "@/components/visuals/gradly-mobile-visual";
import { GradlyProductImages } from "@/components/visuals/gradly-product-images";
import { GradlyImmigrationIllustration } from "@/components/visuals/gradly-immigration-illustration";
import { ClaimsAdjudicationVisual } from "@/components/visuals/claims-adjudication-visual";
import { InsuranceConciergeVisual } from "@/components/visuals/insurance-concierge-visual";
import { GradlyLinksIllustration } from "@/components/visuals/gradly-links-illustration";
import { FivePointsProductImage } from "@/components/visuals/fivepoints-product-image";
import { ExperimentProductImage } from "@/components/visuals/experiment-product-image";
import { Fragment } from "react";

export function WorkSection() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="site-shell section-heading" data-reveal>
        <p className="section-kicker">Selected work / {String(projects.length).padStart(2, "0")}</p>
        <h1 id="work-title">Proof lives in the work.</h1>
        <p>The kind of problems that don’t come with a spec.</p>
      </div>

      <div className="site-shell project-ledger">
        {[...projects, ...experiments].map((project, index) => (
          <Fragment key={project.slug}>
          {index === projects.length ? (
            <div className="experiments-heading" aria-labelledby="experiments-title">
              <p className="section-kicker">Experiments / 02</p>
              <h2 id="experiments-title">Ideas in motion.</h2>
              <p>Smaller products exploring how a familiar task could feel simpler.</p>
            </div>
          ) : null}
          <article
            className={`project-story project-story--${project.accent} project-story--${project.slug}`}
          >
            <div className="project-copy" data-reveal>
              <div className="project-index">
                {index < projects.length ? `0${index + 1}` : `Experiment 0${index - projects.length + 1}`} / {project.name}
              </div>
              <h2>{project.title}</h2>
              <p className="project-summary">{project.summary}</p>
              <dl className="project-notes">
                <div>
                  <dt>Starting point</dt>
                  <dd>{project.problem}</dd>
                </div>
                <div>
                  <dt>Built</dt>
                  <dd>{project.built}</dd>
                </div>
                <div>
                  <dt>Guardrail</dt>
                  <dd>{project.constraint}</dd>
                </div>
              </dl>
              {project.outcome ? (
                <p className="project-outcome">
                  <span>Known outcome</span>
                  {project.outcome}
                </p>
              ) : null}
              <ul className="tag-list" aria-label="Project areas">
                {project.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
              {project.links.length ? (
                <div className="project-links">
                  {project.links.map((link) => (
                    <a
                      data-analytics-event="project_link_clicked"
                      data-analytics-placement="work"
                      data-analytics-project={
                        (
                          {
                            visafile: "visafile",
                            "gradly-health": "gradly-health",
                            "gradly-mobile-app": "gradly-mobile-app",
                            "gradly-immigration": "gradly-immigration",
                            "gradly-links": "gradly-links",
                            "ai-claims-adjudication": "claims",
                            "ai-insurance-concierge": "ai-insurance-concierge",
                            fivepoints: "fivepoints",
                            sortify: "sortify",
                            crate: "crate",
                          } as Record<string, string>
                        )[project.slug]
                      }
                      data-analytics-category={
                        link.href.includes("github.com") ? "source" : "demo"
                      }
                      href={link.href}
                      key={link.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            {project.slug === "sortify" || project.slug === "crate" ? (
              <ExperimentProductImage project={project.slug} />
            ) : project.slug === "fivepoints" ? (
              <FivePointsProductImage />
            ) : project.slug === "visafile" ? (
              <VisaFileProductImage />
            ) : project.slug === "gradly-health" ? (
              <GradlyProductImages />
            ) : project.slug === "gradly-mobile-app" ? (
              <GradlyMobileVisual />
            ) : project.slug === "gradly-immigration" ? (
              <GradlyImmigrationIllustration />
            ) : project.slug === "ai-claims-adjudication" ? (
              <ClaimsAdjudicationVisual />
            ) : project.slug === "ai-insurance-concierge" ? (
              <InsuranceConciergeVisual />
            ) : project.slug === "gradly-links" ? (
              <GradlyLinksIllustration />
            ) : (
              <div
                className="project-media-placeholder"
                aria-label={`Image placeholder for ${project.name}`}
              >
                <div
                  className="project-media-placeholder__window"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </div>
                <div
                  className="project-media-placeholder__canvas"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </div>
                <p>Project image coming soon</p>
              </div>
            )}
          </article>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
