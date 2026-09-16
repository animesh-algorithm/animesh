import { ArrowUpRight, Demo, GitHub } from "./icons";

type ProjectShowcaseProps = {
  label: string;
  linkLabel: string;
  links?: ReadonlyArray<{
    href: string;
    label: string;
    icon?: "demo" | "github";
  }>;
  title: React.ReactNode;
  description: string;
  meta: string;
  tone: "coral" | "violet" | "blue" | "yellow";
  featured?: boolean;
  children: React.ReactNode;
};

export function ProjectShowcase({ label, linkLabel, links, title, description, meta, tone, featured, children }: ProjectShowcaseProps) {
  const project = ({ VisaFile: "visafile", "AI Insurance Concierge": "concierge", "Gradly Links": "gradly-links", "AI Claims Adjudication": "claims" } as Record<string, string>)[linkLabel];
  const primaryLink = links?.[0];
  const visual = (
    <>
      {children}
      <span className="project-open"><ArrowUpRight /></span>
    </>
  );

  return (
    <article className={`project project-${tone}${featured ? " project-featured" : ""}`}>
      {primaryLink ? (
        <a
          className="project-visual-link"
          data-analytics-event="project_link_clicked" data-analytics-placement="work" data-analytics-project={project} data-analytics-category={primaryLink.icon === "github" ? "source" : "demo"}
          href={primaryLink.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${primaryLink.label}: ${linkLabel}`}
        >
          {visual}
        </a>
      ) : (
        <div className="project-visual-link">{visual}</div>
      )}
      <div className="project-copy">
        <div className="project-story">
          <span className="project-label">{label}</span>
          <h3>{title}</h3>
          <p>{description}</p>
          {links?.length ? (
            <div className="project-links" aria-label={`${linkLabel} links`}>
              {links.map((link) => (
                <a
                  data-analytics-event="project_link_clicked" data-analytics-placement="work" data-analytics-project={project} data-analytics-category={link.icon === "github" ? "source" : "demo"}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={link.href}
                >
                  {link.icon === "demo" ? <Demo /> : null}
                  {link.icon === "github" ? <GitHub /> : null}
                  {link.label}
                  {!link.icon ? <ArrowUpRight /> : null}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <span className="project-meta">{meta}</span>
      </div>
    </article>
  );
}
