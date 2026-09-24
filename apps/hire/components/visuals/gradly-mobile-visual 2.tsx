import Image from "next/image";

const screens = [
  { name: "Splash screen", position: "2.3%" },
  { name: "Onboarding", position: "16%" },
  { name: "Sign in", position: "29.8%" },
  { name: "Home", position: "43.5%" },
  { name: "File a claim", position: "57.6%" },
  { name: "Claim status", position: "70.9%" },
  { name: "Find providers", position: "84.4%" },
  { name: "Help center", position: "98.3%" },
] as const;

export function GradlyMobileVisual() {
  return (
    <figure className="gradly-mobile-visual">
      <div className="gradly-mobile-visual__header">
        <Image src="/images/gradly.svg" width={75} height={40} alt="Gradly" />
        <span>Mobile app / student health insurance</span>
      </div>
      <div className="gradly-mobile-visual__screens" aria-label="Eight Gradly mobile app screens from the supplied reference">
        {screens.map((screen) => (
          <div className="gradly-mobile-visual__item" key={screen.name}>
            <span className="gradly-mobile-visual__label">{screen.name}</span>
            <div
              className="gradly-mobile-visual__screen"
              role="img"
              aria-label={`${screen.name} screen from the supplied Gradly Mobile App reference`}
              style={{ backgroundPosition: `${screen.position} 54%` }}
            />
          </div>
        ))}
      </div>
      <figcaption>
        Supplied Gradly Mobile App artwork. The screens are a design reference;
        the artwork’s figures, testimonial, and store badges are not verified outcomes or availability.
        <a href="/images/gradly-mobile-reference.png" target="_blank" rel="noreferrer">View the complete reference ↗</a>
      </figcaption>
    </figure>
  );
}
