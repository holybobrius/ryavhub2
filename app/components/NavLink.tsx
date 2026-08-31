"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import "./nav-link.css";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  /** Явно задать активность; по умолчанию — по совпадению с текущим путём. */
  active?: boolean;
}

/**
 * Навигационная ссылка навбара. Клиентский компонент: подсвечивает активную
 * страницу через usePathname(). Состояния (hover/pressed/focused) — в CSS.
 * Живёт только в навбаре, поэтому здесь, а не в shared/ui + Storybook.
 */
export function NavLink({ href, children, active }: NavLinkProps) {
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
}
