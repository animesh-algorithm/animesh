import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m10 6-6 6 6 6M4 12h16" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m7 7 10 10M17 7 7 17" />
    </Icon>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3c.5 5.5 3.5 8.5 9 9-5.5.5-8.5 3.5-9 9-.5-5.5-3.5-8.5-9-9 5.5-.5 8.5-3.5 9-9Z" />
    </Icon>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 18h6M10 22h4M8.5 14.5A7 7 0 1 1 15.5 14.5c-1 .8-1.5 1.5-1.5 2.5h-4c0-1-.5-1.7-1.5-2.5Z" />
    </Icon>
  );
}

export function CheckboxIcon({ checked, ...props }: IconProps & { checked: boolean }) {
  return (
    <Icon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      {checked && <path d="m8 12 2.7 2.7L16.5 9" />}
    </Icon>
  );
}
