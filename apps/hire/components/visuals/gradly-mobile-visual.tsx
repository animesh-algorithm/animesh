import Image from "next/image";

function ArtworkScreen({ name, src }: { name: string; src: string }) {
  return (
    <a className="gradly-mobile-visual__open" href={src} target="_blank" rel="noreferrer" aria-label={`Open ${name} screen full size`}>
      <div
        className="gradly-phone gradly-phone--artwork"
        role="img"
        aria-label={`${name} screen supplied as Gradly artwork`}
      >
        <Image src={src} alt="" fill sizes="216px" unoptimized />
        {name === "Sign in" ? (
          <div className="gradly-phone__status" aria-hidden="true">
            <span>9:41</span>
            <svg viewBox="0 0 38 14" fill="none">
              <path d="M1 12V9h2v3zm4 0V7h2v5zm4 0V5h2v7zm4 0V2h2v10z" fill="currentColor" />
              <path d="M19 5c2.5-2.5 6.5-2.5 9 0m-7 2.5c1.5-1.5 4-1.5 5.5 0M24 10h.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="31" y="3" width="5" height="9" rx="1.5" stroke="currentColor" />
              <rect x="32" y="4" width="3" height="7" rx=".5" fill="currentColor" />
              <path d="M37 6v3" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </div>
        ) : null}
        <div className="gradly-phone__island" aria-hidden="true" />
        <div className="gradly-phone__indicator" aria-hidden="true" />
      </div>
    </a>
  );
}

const screens = [
  {
    name: "Sign in",
    content: <ArtworkScreen name="Sign in" src="/images/gradly-mobile-signin.svg" />,
  },
  {
    name: "Home",
    content: <ArtworkScreen name="Home" src="/images/gradly-mobile-home.png" />,
  },
  {
    name: "Find providers",
    content: (
      <ArtworkScreen
        name="Find providers"
        src="/images/gradly-mobile-providers.svg"
      />
    ),
  },
] as const;

export function GradlyMobileVisual() {
  return (
    <figure className="gradly-mobile-visual">
      <div
        className="gradly-mobile-visual__screens"
        aria-label="Three Gradly mobile app screens"
        tabIndex={0}
      >
        {screens.map((screen) => (
          <div className="gradly-mobile-visual__item" key={screen.name}>
            {screen.content}
          </div>
        ))}
      </div>
      <p className="gradly-mobile-visual__hint">Swipe for more screens · Tap to enlarge</p>
    </figure>
  );
}
