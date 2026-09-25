import { ScrollMotion } from "@/components/scroll-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Asterisk,
  ChatBubble,
  Spark,
} from "@/components/icons";
import { AskAnimeshLink } from "@/components/ask-animesh";
import { ExperimentsShelf } from "@/components/experiments-shelf";
import { ProjectShowcase } from "@/components/project-showcase";
import {
  ClaimsVisual,
  DataVisual,
  StudioVisual,
  VisaFlowVisual,
} from "@/components/project-visuals";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import {
  experience,
  experiments,
  notes,
  profile,
  projects,
  workCopy,
} from "@/content/profile";
import { connection } from "next/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Animesh Sharma", title: "Animesh Sharma — Engineering, AI & automation", description: "Animesh Sharma is a product engineer building AI products, full-stack software, and automation. Explore selected projects and the thinking behind them.", url: "/" },
  twitter: { card: "summary_large_image", title: "Animesh Sharma — Engineering, AI & automation", description: "Animesh Sharma is a product engineer building AI products, full-stack software, and automation. Explore selected projects and the thinking behind them.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Animesh Sharma — I figure things out. Then I build them." }] },
};

function randomOption<const Options extends readonly string[]>(
  options: Options,
) {
  return options[Math.floor(Math.random() * options.length)];
}

function highlightExperienceCopy(
  paragraph: string,
  emphasis: readonly string[],
) {
  const escaped = emphasis.map((phrase) =>
    phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  return paragraph.split(new RegExp(`(${escaped.join("|")})`, "g"));
}

export default async function Home() {
  await connection();

  const workHeadline = randomOption(workCopy.headlines);
  const workEyebrow = randomOption(workCopy.eyebrows);
  const workDescription = randomOption(workCopy.descriptions);
  const [visaFile, concierge, gradlyLinks, claims] = projects;

  return (
    <main id="top">
      <ScrollMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([{
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://www.animesh.cc/about#person",
            name: "Animesh Sharma",
            url: "https://www.animesh.cc/about",
            jobTitle: "Product Engineer",
            sameAs: [
              profile.links.linkedin,
              profile.links.github,
              profile.links.twitter,
            ],
            description: "Engineer, product person, and automation builder.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://www.animesh.cc/#website",
            name: "Animesh Sharma",
            url: "https://www.animesh.cc/",
          }]).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-status">
          <span />
          OPEN TO GOOD IDEAS & GOOD CONVERSATIONS
        </div>
        <h1 id="hero-title">
          <span className="hero-line">I figure things out.</span> <br />
          <span className="hero-line">
            Then I <br className="hero-mobile-break" />
            <em>build</em> them.
          </span>
        </h1>
        <div className="hero-bottom">
          <div className="hero-intro">
            <p>
              Engineer, product person, automation obsessive, and professional{" "}
              <strong className="hero-quote">
                “give it to Animesh, he’ll figure it out”
              </strong>{" "}
              person.
            </p>
            <AskAnimeshLink className="hero-ask-link ask-cta-button">
              <ChatBubble /> Ask me anything
            </AskAnimeshLink>
          </div>
          <a
            className="circle-link"
            href="#work"
            aria-label="See selected work"
          >
            <ArrowDown />
          </a>
        </div>
        <Spark className="hero-spark" />
        <div className="hero-sticker">
          <span>BUILD</span>
          <b>
            <ArrowDownRight />
          </b>
          <span>SHIP</span>
        </div>
      </section>

      <section
        className="work-section chapter chapter-paper-deep scallop-top"
        id="work"
        aria-labelledby="work-title"
      >
        <div className="shell work-inner">
          <SectionHeading
            id="work-title"
            eyebrow={workEyebrow}
            title={workHeadline}
            aside={workDescription}
          />
          <div className="project-list">
            <ProjectShowcase
              label={`Project 01 — ${visaFile.name}`}
              linkLabel={visaFile.name}
              links={visaFile.links}
              title={visaFile.title}
              description={visaFile.description}
              meta={visaFile.meta}
              credit="Built by Animesh Sharma"
              tone={visaFile.tone}
              featured={visaFile.featured}
            >
              <VisaFlowVisual />
            </ProjectShowcase>
            <div className="project-pair">
              <ProjectShowcase
                label={`Project 02 — ${concierge.name}`}
                linkLabel={concierge.name}
                links={concierge.links}
                title={concierge.title}
                description={concierge.description}
                meta={concierge.meta}
                credit="Product and engineering at Gradly · Animesh Sharma"
                tone={concierge.tone}
              >
                <StudioVisual />
              </ProjectShowcase>
              <ProjectShowcase
                label={`Project 03 — ${gradlyLinks.name}`}
                linkLabel={gradlyLinks.name}
                links={gradlyLinks.links}
                title={gradlyLinks.title}
                description={gradlyLinks.description}
                meta={gradlyLinks.meta}
                credit="Built at Gradly by Animesh Sharma"
                tone={gradlyLinks.tone}
              >
                <DataVisual />
              </ProjectShowcase>
            </div>
            <ProjectShowcase
              label={`Project 04 — ${claims.name}`}
              linkLabel={claims.name}
              links={claims.links}
              title={
                <>
                  Upload the bill.
                  <br />
                  We’ll handle the rest.
                </>
              }
              description={claims.description}
              meta={claims.meta}
              credit="Product and engineering at Gradly · Animesh Sharma"
              tone={claims.tone}
            >
              <ClaimsVisual />
            </ProjectShowcase>
            <ExperimentsShelf experiments={experiments} />
          </div>
          <div className="work-ask-cta">
            <p>You’ve seen the work. Ask for the story.</p>
            <AskAnimeshLink className="ask-cta-button ask-cta-dark">
              <ChatBubble /> Ask about a project
            </AskAnimeshLink>
          </div>
        </div>
      </section>

      <section
        className="about-section chapter chapter-cobalt scallop-top"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="shell about-grid">
          <div className="about-mark">
            <Asterisk />
          </div>
          <div className="about-copy">
            <p className="eyebrow">02 / About</p>
            <h2 id="about-title">
              Engineer on paper. <em>Problem solver</em> in practice.
            </h2>
            <div className="about-body">
              {profile.biography.map(({ paragraphs, beat, strongBeat }) => (
                <div className="about-passage" key={paragraphs[0]}>
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {beat ? (
                    <p className="about-beat">
                      {strongBeat ? <strong>{beat}</strong> : beat}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="about-actions">
              <AskAnimeshLink className="about-ask-link ask-cta-button">
                <ChatBubble /> Know more about me
              </AskAnimeshLink>
              <a
                className="about-resume-link"
                data-analytics-event="resume_clicked"
                data-analytics-placement="about"
                data-analytics-category="resume"
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
              >
                View résumé <ArrowUpRight />
              </a>
            </div>
          </div>
          <aside className="about-side">
            <div>
              <span>BASED IN</span>
              <strong>{profile.location}</strong>
            </div>
            <div>
              <span>WORKS ACROSS</span>
              <strong>{profile.worksAcross.join(", ")}</strong>
            </div>
            <div>
              <span>GOOD AT</span>
              <strong>{profile.strengths.join(", ")}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="experience-section chapter chapter-butter scallop-top"
        aria-labelledby="experience-title"
      >
        <div className="shell">
          <SectionHeading
            id="experience-title"
            eyebrow="03 / Experience"
            title="I kept picking up problems until my job title had to catch up."
          />
          <div className="experience-list">
            {experience.map(
              ({
                period,
                role,
                company,
                headline,
                paragraphs,
                emphasis,
                closing,
              }) => (
                <div className="experience-row" key={period}>
                  <span className="experience-period">{period}</span>
                  <div className="experience-role">
                    <h3>{role}</h3>
                    <p>{company}</p>
                  </div>
                  <div className="experience-description">
                    <p className="experience-headline">{headline}</p>
                    <div className="experience-copy">
                      {paragraphs.map((paragraph) => {
                        const parts = highlightExperienceCopy(
                          paragraph,
                          emphasis,
                        );

                        return (
                          <p key={paragraph}>
                            {parts.map((part, index) =>
                              emphasis.includes(part) ? (
                                <strong key={`${part}-${index}`}>{part}</strong>
                              ) : (
                                part
                              ),
                            )}
                          </p>
                        );
                      })}
                      {closing ? (
                        <p className="experience-closing">{closing}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
          <Spark className="experience-mark" />
        </div>
      </section>

      <section
        className="now-section chapter chapter-coral scallop-top"
        aria-labelledby="now-title"
      >
        <div className="now-card shell">
          <div className="now-orbit">
            <Spark />
            <i />
            <i />
          </div>
          <div className="now-copy">
            <p className="eyebrow">04 / Right now</p>
            <h2 id="now-title">
              Currently building, learning &amp; following{" "}
              <em>whatever looks useful.</em>
            </h2>
          </div>
          <ul>
            {profile.current.map((item, index) => (
              <li key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </li>
            ))}
            <li>
              <span>0{profile.current.length + 1}</span>
              <strong>
                Building for founders at{" "}
                <a href="https://hire.animesh.cc" target="_blank" rel="noopener noreferrer">
                  <span>Hire Animesh</span> <ArrowUpRight />
                </a>
              </strong>
            </li>
          </ul>
        </div>
      </section>

      <section
        className="notes-section chapter chapter-paper scallop-top"
        id="notes"
        aria-labelledby="notes-title"
      >
        <div className="shell notes-inner">
          <SectionHeading
            id="notes-title"
            eyebrow="05 / Notes"
            title="Opinions, loosely organized."
            aside="Things I’ve learned from building software, breaking software, fixing operations, talking to users, and occasionally doing things the hard way."
          />
          <div className="notes-list">
            {notes.map(({ title, description, readingTime, href }, index) => (
              <a
                className="note-row"
                href={href}
                key={title}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="note-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="note-time">{readingTime} read</span>
                <span className="note-arrow">
                  <ArrowUpRight />
                </span>
              </a>
            ))}
            <a
              className="note-row note-row-all"
              href="https://blog.animesh.cc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="note-index">All</span>
              <h3>The rest of the notebook.</h3>
              <p>More thoughts on building, learning, and figuring things out.</p>
              <span className="note-time">Explore the blog</span>
              <span className="note-arrow">
                <ArrowUpRight />
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer
        className="contact-section chapter chapter-blue scallop-top"
        id="contact"
      >
        <div className="shell contact-inner">
          <p className="eyebrow">06 / Work together</p>
          <h2>
            Got a hard problem?
            <br />
            <em>
              Even better if you’re
              <br />
              not sure how to solve it.
            </em>
          </h2>
          <a
            className="ask-cta-button contact-button"
            data-analytics-event="contact_link_clicked"
            data-analytics-placement="footer"
            data-analytics-category="hire"
            href="https://hire.animesh.cc"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore working together <ArrowUpRight />
          </a>
          <div className="footer-ask-cta">
            <p>Still have questions?</p>
            <AskAnimeshLink className="ask-cta-button ask-cta-light">
              <ChatBubble /> Ask Animesh
            </AskAnimeshLink>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Animesh Sharma · Personal website</span>
            <div>
              <a href="https://blog.animesh.cc">Blog</a>
              <a href="/privacy">Privacy</a>
              <a
                data-analytics-event="contact_link_clicked"
                data-analytics-placement="footer"
                data-analytics-category="social"
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                data-analytics-event="contact_link_clicked"
                data-analytics-placement="footer"
                data-analytics-category="social"
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                data-analytics-event="contact_link_clicked"
                data-analytics-placement="footer"
                data-analytics-category="social"
                href={profile.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                X / Twitter
              </a>
              <a
                data-analytics-event="resume_clicked"
                data-analytics-placement="footer"
                data-analytics-category="resume"
                href={profile.links.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                Résumé
              </a>
            </div>
            <a className="consulting-link" href="https://hire.animesh.cc">
              Looking for professional project help?{" "}
              <span>
                Work with me <ArrowUpRight />
              </span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
