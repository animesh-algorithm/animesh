import Image from "next/image";

const countries = [
  { name: "United States", clicks: "3", share: "33%" },
  { name: "Turkey", clicks: "2", share: "22%" },
  { name: "France", clicks: "2", share: "22%" },
  { name: "Vietnam", clicks: "1", share: "11%" },
  { name: "India", clicks: "1", share: "11%" },
] as const;

const cities = [
  ["Los Angeles", "2"],
  ["Idil", "1"],
  ["Hanoi", "1"],
  ["Istanbul", "1"],
  ["Paris", "1"],
  ["Delhi", "1"],
] as const;

export function GradlyLinksIllustration() {
  return (
    <figure className="gradly-links">
      <div className="gradly-links__window">
        <div className="gradly-links__browser" aria-hidden="true">
          <span className="gradly-links__controls"><i /><i /><i /></span>
          <span>dashboard.gradly.us/links/usc-supreme-plus</span>
        </div>
        <div className="gradly-links__app">
          <aside className="gradly-links__rail" aria-hidden="true">
            <Image src="/images/gradly.svg" alt="" width={69} height={21} />
            <span className="gradly-links__rail-label">LINKS</span>
            <div className="gradly-links__rail-link gradly-links__rail-link--active"><b>Supreme Plus</b><small>Public brochure</small></div>
            <div className="gradly-links__rail-link"><b>Member link</b><small>••••••••</small></div>
            <div className="gradly-links__rail-link"><b>Member link</b><small>••••••••</small></div>
          </aside>
          <div className="gradly-links__dashboard">
            <div className="gradly-links__heading">
              <div><span>LINK ANALYTICS</span><strong>Supreme Plus</strong><small>link.gradly.us/usc-supreme-plus</small></div>
              <span className="gradly-links__status">Active</span>
            </div>
            <div className="gradly-links__tabs"><span>Overview</span><b>Audience</b><span>Traffic</span><span>Events</span></div>
            <div className="gradly-links__metrics">
              <div><span>Total clicks</span><strong>301</strong><small>All time</small></div>
              <div><span>Unique visitors</span><strong>242</strong><small>All time</small></div>
              <div><span>Geographic reach</span><strong>5</strong><small>Countries</small></div>
            </div>
            <div className="gradly-links__analytics">
              <div className="gradly-links__map-card">
                <div className="gradly-links__card-title"><strong>Geographic reach</strong><small>5 countries · 6 cities</small></div>
                <Image src="/images/gradly-links-world.svg" alt="World map highlighting visitors in the United States, Turkey, France, Vietnam, and India" width={800} height={320} unoptimized />
                <div className="gradly-links__map-scale"><span>0</span><i /><span>3</span><small>top cities (size = clicks)</small></div>
              </div>
              <div className="gradly-links__countries">
                <strong>Top countries</strong>
                {countries.map((country) => (
                  <div className="gradly-links__country" key={country.name}>
                    <span>{country.name}</span><b>{country.clicks}</b><small>{country.share}</small>
                    <i style={{ width: country.share }} />
                  </div>
                ))}
              </div>
              <div className="gradly-links__cities">
                <strong>Top cities</strong>
                <div>{cities.map(([name, clicks]) => <span key={name}>{name}<b>{clicks}</b></span>)}</div>
              </div>
              <div className="gradly-links__flow">
                <div className="gradly-links__card-title"><strong>Traffic overview</strong><small>Click activity</small></div>
                <svg viewBox="0 0 280 62" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50H280M0 30H280M0 10H280" stroke="#e9edf4" strokeWidth="1" /><path d="M0 52 22 46 44 49 65 35 88 41 110 28 133 33 155 19 179 28 199 15 221 21 242 8 260 17 280 6" fill="none" stroke="#315dce" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
