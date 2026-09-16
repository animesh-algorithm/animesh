import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-layout">
        <p><strong>{site.person}</strong><br />{site.positioning}</p>
        <div className="footer-links">
          {site.socialLinks.map((link) => <a href={link.href} key={link.href} rel="noreferrer" target="_blank">{link.label}</a>)}
        </div>
        <p>© {new Date().getFullYear()}<br />Built for clear conversations.</p>
      </div>
    </footer>
  );
}
