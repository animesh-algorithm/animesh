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
