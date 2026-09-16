import { site } from "@/content/site";
import { SiteShell } from "@/components/layout/site-shell";

export function SiteHeader() {
  return (
    <div className="site-header-band">
      <SiteShell>
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label={`${site.name}, home`}>
            <span className="wordmark__text">
              <span>Hire</span>
              <span>Animesh</span>
            </span>
            <span className="wordmark__sun" aria-hidden="true" />
          </a>
          <nav className="primary-nav" aria-label="Primary navigation">
            {site.navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
            <a className="button" href="#book">
              Book a call
            </a>
          </nav>
          <details className="mobile-nav">
            <summary>Menu</summary>
            <nav aria-label="Mobile navigation">
              {site.navigation.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
              <a href="#book">Book a call</a>
            </nav>
          </details>
        </header>
      </SiteShell>
    </div>
  );
}
