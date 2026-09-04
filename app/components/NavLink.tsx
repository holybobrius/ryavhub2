"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import "./nav-link.css";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
}

export const NavLink = ({ href, children, active }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive =
    active ??
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className="nav-link"
      data-active={isActive ? "true" : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
};
