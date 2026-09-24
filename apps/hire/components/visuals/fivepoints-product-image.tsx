import Image from "next/image";

export function FivePointsProductImage() {
  return (
    <figure className="visafile-product-image fivepoints-product-image">
      <div className="visafile-product-image__window">
        <div className="visafile-product-image__bar" aria-hidden="true">
          <span className="visafile-product-image__controls">
            <i />
            <i />
            <i />
          </span>
          <span className="visafile-product-image__title">FivePoints</span>
        </div>
        <Image
          src="/images/fivepoints-hero.jpg"
          alt="FivePoints homepage hero with its dark navigation, Insurance Done Better headline, and health plan message over a city photograph"
          width={1440}
          height={900}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </figure>
  );
}
