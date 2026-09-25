"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ChatBubble } from "./icons";
import { AskAnimeshLink } from "./ask-animesh";

const navItems = [
  { href: "#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "#notes", label: "Notes" },
  { href: "https://blog.animesh.cc", label: "Blog" },
];

export function SiteHeader({ home = true }: { home?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner shell">
        <a className="monogram" href={home ? "#top" : "/"} aria-label={home ? "Animesh, back to top" : "Animesh, home"}>
          <span>A</span>
          <span className="monogram-dot" />
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href={home || !item.href.startsWith("#") ? item.href : `/${item.href}`} key={item.href}>{item.label}</a>
          ))}
          <a data-analytics-event="resume_clicked" data-analytics-placement="header" data-analytics-category="resume" href="/resume">Résumé</a>
        </nav>
        <div className="header-actions">
          <AskAnimeshLink className="header-ask">
            <ChatBubble /> Ask Animesh
          </AskAnimeshLink>
          <a className="header-contact" data-analytics-event="contact_link_clicked" data-analytics-placement="header" data-analytics-category="hire" href="https://hire.animesh.cc" target="_blank" rel="noopener noreferrer">
            Work with me <ArrowUpRight />
          </a>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
        <div className="mobile-menu" data-open={menuOpen ? "true" : "false"} id="mobile-navigation">
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a href={home || !item.href.startsWith("#") ? item.href : `/${item.href}`} key={item.href} onClick={closeMenu}>{item.label}</a>
            ))}
            <a href="/resume" onClick={closeMenu}>Résumé</a>
          </nav>
          <div className="mobile-menu-actions">
            <AskAnimeshLink className="mobile-menu-ask" onClick={closeMenu}>
              <ChatBubble /> Ask Animesh
            </AskAnimeshLink>
            <a href="https://hire.animesh.cc" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Work with me <ArrowUpRight /></a>
          </div>
        </div>
      </div>
    </header>
  );
}
