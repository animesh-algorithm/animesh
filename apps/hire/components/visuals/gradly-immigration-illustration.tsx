import Image from "next/image";

export function GradlyImmigrationIllustration() {
  return (
    <figure className="gradly-immigration-illustration">
      <div className="gradly-immigration-illustration__window">
        <div className="gradly-immigration-illustration__bar" aria-hidden="true">
          <span className="gradly-immigration-illustration__controls">
            <i /><i /><i />
          </span>
          <span className="gradly-immigration-illustration__address">gradly.us</span>
        </div>
        <Image
          src="/images/gradly-immigration-home.png"
          alt="Gradly Immigration homepage with its move-to-the-US headline and student journey dashboard preview"
          width={2880}
          height={1754}
          sizes="(max-width: 1120px) 100vw, 50vw"
        />
      </div>
      <figcaption>Gradly Immigration website and student journey preview</figcaption>
    </figure>
  );
}
