import Image from "next/image";

const captures = {
  sortify: {
    name: "Sortify",
    src: "/images/sortify-hero.jpg",
    height: 1000,
    alt: "Sortify homepage hero with a lavender background, large music headline, illustrated record, and playlist cards",
  },
  crate: {
    name: "Crate",
    src: "/images/crate-hero.jpg",
    height: 900,
    alt: "Crate homepage hero with its private-library message, purple action button, and overlapping saved-photo cards",
  },
} as const;

export function ExperimentProductImage({ project }: { project: keyof typeof captures }) {
  const capture = captures[project];

  return (
    <figure className={`visafile-product-image experiment-product-image experiment-product-image--${project}`}>
      <div className="visafile-product-image__window">
        <div className="visafile-product-image__bar" aria-hidden="true">
          <span className="visafile-product-image__controls"><i /><i /><i /></span>
          <span className="visafile-product-image__title">{capture.name}</span>
        </div>
        <Image src={capture.src} alt={capture.alt} width={1440} height={capture.height} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <figcaption>Public homepage capture</figcaption>
    </figure>
  );
}
