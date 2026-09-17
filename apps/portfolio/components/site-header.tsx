import { ArrowUpRight, ChatBubble } from "./icons";
import { AskAnimeshLink } from "./ask-animesh";

const navItems = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#notes", label: "Notes" },
  { href: "https://blog.animesh.cc", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner shell">
        <a className="monogram" href="#top" aria-label="Animesh, back to top">
          <span>A</span>
          <span className="monogram-dot" />
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
          <a data-analytics-event="resume_clicked" data-analytics-placement="header" data-analytics-category="resume" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
        <div className="header-actions">
          <AskAnimeshLink className="header-ask">
            <ChatBubble /> Ask Animesh
          </AskAnimeshLink>
          <a className="header-contact" data-analytics-event="contact_link_clicked" data-analytics-placement="header" href="#contact">
            Say hello <ArrowUpRight />
          </a>
        </div>
      </div>
    </header>
  );
}
