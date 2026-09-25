import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experiments, projects } from "@/content/projects";

const work = [...projects, ...experiments];

export function generateStaticParams() {
  return work.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = work.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  const title = `${project.name} — ${project.title} — By Animesh Sharma`;
  const url = `/work/${slug}`;
  return {
    title: { absolute: title },
    description: project.summary,
    alternates: { canonical: url },
    openGraph: { title, description: project.summary, url },
    twitter: { title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = work.find((item) => item.slug === slug);
  if (!project) notFound();

  return <main id="main-content" className="site-shell v2-page-tail">
    <p className="section-kicker">Selected work / {project.name}</p>
    <h1>{project.title}</h1>
    <p>{project.summary}</p>
    <section aria-labelledby="project-problem"><h2 id="project-problem">The problem</h2><p>{project.problem}</p></section>
    <section aria-labelledby="project-built"><h2 id="project-built">What I built</h2><p>{project.built}</p></section>
    <section aria-labelledby="project-constraint"><h2 id="project-constraint">A key constraint</h2><p>{project.constraint}</p></section>
    {project.outcome && <section aria-labelledby="project-outcome"><h2 id="project-outcome">Known outcome{Array.isArray(project.outcome) ? "s" : ""}</h2>{Array.isArray(project.outcome) ? <ul>{project.outcome.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{project.outcome}</p>}</section>}
    {project.links.length > 0 && <nav aria-label="Project links" className="hero-actions">{project.links.map((link) => <a className="text-link" key={link.href} href={link.href} rel="noreferrer" target="_blank">{link.label}</a>)}</nav>}
    <Link className="text-link" href="/work">All work</Link>
  </main>;
}
