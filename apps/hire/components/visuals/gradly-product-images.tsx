import Image from "next/image";

const surfaces = [
  {
    label: "Insurance plans",
    src: "/images/gradly-insurance-hero.png",
    alt: "Gradly insurance website with its header, insurance hero, university search, and member app preview",
    width: 2880,
    height: 2080,
  },
  {
    label: "Member app",
    src: "/images/gradly-member.jpg",
    alt: "Gradly member app tools for finding providers, filing claims, waiver help, and renewals",
    width: 1400,
    height: 800,
  },
  {
    label: "Internal dashboard",
    src: "/images/gradly-operations-concept.png",
    alt: "Illustrative Gradly operations dashboard concept with example positive metrics and rising charts; figures are fictional",
    width: 1672,
    height: 941,
  },
] as const;

export function GradlyProductImages() {
  return (
    <figure
      className="gradly-product-images"
      aria-label="Three Gradly product screenshots"
    >
      {surfaces.map((surface) => (
        <div className="gradly-product-images__window" key={surface.src}>
          <div className="gradly-product-images__bar" aria-hidden="true">
            <span className="gradly-product-images__controls">
              <i />
              <i />
              <i />
            </span>
            <span className="gradly-product-images__title">
              {surface.label}
            </span>
          </div>
          <Image
            src={surface.src}
            alt={surface.alt}
            width={surface.width}
            height={surface.height}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
      <figcaption className="gradly-product-images__caption">
        Insurance plans <span>·</span> Member app <span>·</span> Illustrative
        operations concept
      </figcaption>
    </figure>
  );
}
