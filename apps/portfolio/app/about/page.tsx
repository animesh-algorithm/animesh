import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { experience, experiments, profile, projects } from "@/content/profile";

const description = "Meet Animesh Sharma, a product engineer working across software, AI, and automation. Read about his background at Gradly, selected projects, and how he approaches complex problems.";

export const metadata: Metadata = {
  title: "About Animesh Sharma — Product Engineer",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Animesh Sharma — Product Engineer", description, url: "/about" },
  twitter: { title: "About Animesh Sharma — Product Engineer", description },
};

export default function AboutPage() {
  return (
    <main id="top" className="profile-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://www.animesh.cc/#person",
        name: profile.name,
        url: "https://www.animesh.cc/about",
        jobTitle: "Product Engineer",
        sameAs: [profile.links.linkedin, profile.links.github, profile.links.twitter],
      }).replace(/</g, "\\u003c") }} />
      <SiteHeader home={false} />
      <article>
        <header className="profile-hero chapter chapter-paper">
          <div className="shell profile-hero-grid">
            <div>
              <p className="eyebrow">THE PERSON BEHIND THE WORK</p>
              <h1>About <em>Animesh Sharma.</em></h1>
              <p className="profile-lede">Engineer, product person, automation obsessive, and problem solver.</p>
              <p>I work across engineering, product, and operations. I like the problems that start with incomplete context and end with something useful in people’s hands.</p>
              <div className="profile-hero-links">
                <a href={profile.links.resume}>Read my résumé</a>
                <Link href="/#work">Explore selected work</Link>
              </div>
            </div>
          </div>
        </header>

        <section className="profile-story chapter chapter-cobalt" aria-labelledby="profile-story-title">
          <div className="shell profile-section-grid">
            <p className="eyebrow">01 / BACKGROUND</p>
            <div>
              <h2 id="profile-story-title">I figure things out. Then I build them.</h2>
              {profile.biography.map(({ paragraphs, beat }) => (
                <div className="profile-prose-block" key={paragraphs[0]}>
                  {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {beat && <p className="profile-story-beat">{beat}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="profile-expertise chapter chapter-paper-deep" aria-labelledby="profile-expertise-title">
          <div className="shell profile-section-grid">
            <p className="eyebrow">02 / WHAT I BUILD</p>
            <div>
              <h2 id="profile-expertise-title">Products, systems, and the work between them.</h2>
              <p className="profile-section-intro">My work sits where product decisions meet implementation: finding the real problem, building the software, and improving the workflow around it.</p>
              <div className="profile-expertise-list">
                <div><h3>Product engineering</h3><p>Web and mobile products, internal tools, and the backend systems that keep them useful after launch.</p></div>
                <div><h3>Applied AI</h3><p>AI support and claims workflows grounded in customer context, reviewable decisions, and real product needs.</p></div>
                <div><h3>Automation</h3><p>Replacing repetitive handoffs and manual processes with software that gives people time back.</p></div>
                <div><h3>Product and operations</h3><p>Working across teams to define scope, unblock decisions, and get useful work shipped.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-career chapter chapter-butter" aria-labelledby="profile-career-title">
          <div className="shell profile-section-grid">
            <p className="eyebrow">03 / EXPERIENCE</p>
            <div>
              <h2 id="profile-career-title">From founding engineer to broader product leadership.</h2>
              <div className="profile-career-list">
                {experience.map((item) => (
                  <div className="profile-career-item" key={item.role}>
                    <span>{item.period}</span>
                    <div><h3>{item.role}</h3><p className="profile-company">{item.company}</p></div>
                    <div><p className="profile-career-headline">{item.headline}</p>{item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="profile-projects chapter chapter-paper" aria-labelledby="profile-projects-title">
          <div className="shell profile-section-grid">
            <p className="eyebrow">04 / SELECTED WORK</p>
            <div>
              <h2 id="profile-projects-title">A few things I’ve built.</h2>
              <div className="profile-project-list">
                {[...projects, ...experiments].map((project) => (
                  <div className="profile-project-item" key={project.id}>
                    <div><h3>{project.name}</h3><p>{project.meta}</p></div>
                    <p>{project.description}</p>
                    {project.links.length > 0 && <div className="profile-project-links">{project.links.map((link) => <a href={link.href} key={link.href}>{link.label} ↗</a>)}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="profile-footer chapter chapter-cobalt">
          <div className="shell profile-section-grid">
            <p className="eyebrow">05 / ELSEWHERE</p>
            <div>
              <h2>Find me around the web.</h2>
              <p>For the longer version, read my writing or résumé. For a conversation, email me or find me on a professional profile.</p>
              <div className="profile-social-links">
                <a href={profile.links.linkedin}>LinkedIn</a>
                <a href={profile.links.github}>GitHub</a>
                <a href={profile.links.twitter}>X</a>
                <a href="https://blog.animesh.cc">Writing</a>
                <a href={profile.links.resume}>Résumé</a>
                <a href={`mailto:${profile.email}`}>Email</a>
              </div>
              <Link className="profile-home-link" href="/">← Back to the portfolio</Link>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
