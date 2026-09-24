import Image from "next/image";

type IconName = "mail" | "lock";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Phone({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div
      className="gradly-phone"
      role="img"
      aria-label={`${title} screen, illustrative design based on the supplied reference`}
    >
      <div className="gradly-phone__island" aria-hidden="true" />
      <div className="gradly-phone__status">
        <strong>9:41</strong>
        <span aria-hidden="true" className="gradly-phone__system-icons">
          <svg viewBox="0 0 32 14">
            <path
              d="M1 12h2V9H1Zm4 0h2V7H5Zm4 0h2V5H9Zm4 0h2V2h-2Z"
              fill="currentColor"
            />
            <path
              d="M20 4c2-2 5-2 7 0m-6 3c1-1 4-1 5 0m-3 3h1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect
              x="28"
              y="5"
              width="3"
              height="6"
              rx="1"
              fill="currentColor"
            />
          </svg>
          <span className="gradly-phone__battery" />
        </span>
      </div>
      {children}
      <div className="gradly-phone__indicator" aria-hidden="true" />
    </div>
  );
}

function ArtworkScreen({ name, src }: { name: string; src: string }) {
  return (
    <div
      className="gradly-phone gradly-phone--artwork"
      role="img"
      aria-label={`${name} screen supplied as Gradly SVG artwork`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 32vw, 160px"
        unoptimized
      />
      <div className="gradly-phone__island" aria-hidden="true" />
      <div className="gradly-phone__indicator" aria-hidden="true" />
    </div>
  );
}

function SignInScreen() {
  return (
    <Phone title="Sign in">
      <div className="gradly-phone__signin">
        <Image src="/images/gradly.svg" width={96} height={48} alt="Gradly" />
        <strong>Welcome Back to Gradly</strong>
        <p>
          Access your health policy, manage claims, and find providers — all in
          one place.
        </p>
        <div className="gradly-phone__signin-fields">
          <span>
            <Icon name="mail" />
            Email
          </span>
          <span>
            <Icon name="lock" />
            Password
          </span>
        </div>
        <small>Forgot password?</small>
        <div className="gradly-phone__signin-button">Login</div>
        <div className="gradly-phone__signup-button">Sign Up</div>
      </div>
    </Phone>
  );
}

const screens = [
  { name: "Sign in", content: <SignInScreen /> },
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
      >
        {screens.map((screen) => (
          <div className="gradly-mobile-visual__item" key={screen.name}>
            {screen.content}
          </div>
        ))}
      </div>
    </figure>
  );
}
