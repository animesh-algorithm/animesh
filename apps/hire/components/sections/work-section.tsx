import { projects } from "@/content/projects";
import { ProjectVisual } from "@/components/visuals/project-visual";

export function WorkSection() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="site-shell section-heading" data-reveal>
        <p className="section-kicker">Selected work / 04</p>
        <h2 id="work-title">Proof lives in the work.</h2>
        <p>Four systems built around the messy part—not around a technology checklist.</p>
      </div>

      <div className="site-shell project-ledger">
        {projects.map((project, index) => (
          <article className={`project-story project-story--${project.accent}`} key={project.slug}>
            <div className="project-copy" data-reveal>
              <div className="project-index">0{index + 1} / {project.name}</div>
              <h3>{project.title}</h3>
              <p className="project-summary">{project.summary}</p>
              <dl className="project-notes">
                <div><dt>Starting point</dt><dd>{project.problem}</dd></div>
                <div><dt>Built</dt><dd>{project.built}</dd></div>
                <div><dt>Guardrail</dt><dd>{project.constraint}</dd></div>
              </dl>
              {project.outcome ? <p className="project-outcome"><span>Known outcome</span>{project.outcome}</p> : null}
              <ul className="tag-list" aria-label="Project areas">
                {project.areas.map((area) => <li key={area}>{area}</li>)}
              </ul>
              {project.links.length ? (
                <div className="project-links">
                  {project.links.map((link) => <a data-analytics-event="project_link_clicked" data-analytics-placement="work" data-analytics-project={({ visafile: "visafile", "ai-insurance-concierge": "concierge", "gradly-links": "gradly-links", "ai-claims-adjudication": "claims" } as Record<string, string>)[project.slug]} data-analytics-category={link.href.includes("github.com") ? "source" : "demo"} href={link.href} key={link.href} rel="noreferrer" target="_blank">{link.label}</a>)}
                </div>
              ) : null}
            </div>
            <ProjectVisual project={project.slug} />
          </article>
        ))}
      </div>
    </section>
  );
}
