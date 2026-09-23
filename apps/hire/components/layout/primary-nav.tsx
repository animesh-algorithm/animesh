"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PrimaryNavProps {
  navigation: readonly { label: string; href: string }[];
}

export function PrimaryNav({ navigation }: PrimaryNavProps) {
  const pathname = usePathname();

  return (
    <nav className="primary-nav" aria-label="Primary navigation">
      {navigation.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
