import Image from "next/image";

export function VisaFileProductImage() {
  return (
    <figure className="visafile-product-image">
      <div className="visafile-product-image__window">
        <div className="visafile-product-image__bar" aria-hidden="true">
          <span className="visafile-product-image__controls"><i /><i /><i /></span>
          <span className="visafile-product-image__title">VisaFile</span>
        </div>
        <Image
          src="/images/visafile-hero.jpg"
          alt="VisaFile website header and hero showing its headline beside a sample intake form"
          width={1280}
          height={720}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </figure>
  );
}
