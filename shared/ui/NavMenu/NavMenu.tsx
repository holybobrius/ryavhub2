"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

type NavItem = {
  label: ReactNode;
  href: string;
};

interface Props {
  items: NavItem[];
  color?: "dark" | "light";
}

const baseClasses =
  "relative duration-200 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px] after:w-8 after:h-[1px] after:origin-center after:transition-transform after:duration-200";

const variants = {
  dark: {
    default:
      "text-text-secondary hover:text-text-base after:bg-text-secondary after:scale-0 hover:after:scale-100 hover:after:bg-text-primary",
    active:
      "text-text-secondary hover:text-text-base after:bg-text-secondary after:scale-100 hover:after:bg-text-primary",
  },
  light: {
    default:
      "text-text-surface hover:text-text-surface after:bg-text-primary after:scale-0 hover:after:scale-100 hover:after:bg-border-white",
    active:
      "text-text-invert hover:text-text-surface after:bg-text-surface after:scale-100 hover:after:bg-border-white",
  },
};

export const NavMenu: FC<Props> = ({ items, color = "dark" }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(`${href}/`) || pathname === href;

  return (
    <nav className="font-unbounded flex gap-16 text-xl items-center py-0.25">
      {items.map(({ href, label }) => {
        const active = isActive(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`${baseClasses} ${
              variants[color][active ? "active" : "default"]
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
