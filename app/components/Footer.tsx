import { NavLink } from "./NavLink";
import { NAV_ITEMS } from "./navItems";
import type { User } from "@/features/auth/models";

interface FooterProps {
  user: User | null;
}

// Год начала проекта; конец копирайта — текущий год (обновляется сам, т.к.
// layout рендерится динамически на каждый запрос).
const START_YEAR = 2021;

/**
 * Футер приложения. Server-компонент. Навигация — только для авторизованных
 * (у гостя её нет). Копирайт и большой вотермарк-логотип показываем всегда.
 */
export const Footer = ({ user }: FooterProps) => {
  const year = new Date().getFullYear();
  const copyright =
    year > START_YEAR ? `© ${START_YEAR}–${year}` : `© ${START_YEAR}`;

  return (
    <footer className="bg-surface-bg-page px-page-margin py-inset-2xl">
      <div className="flex items-center">
        {user && (
          <nav className="flex items-center gap-space-xl">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
        <span className="ml-auto text-body-md text-surface-text-quaternary">
          {copyright}
        </span>
      </div>

      {/* Вотермарк-логотип РЯВHUB — большой, приглушённый (свой цвет #0F0F0F). */}
      {/* Декоративный, поэтому alt="" + aria-hidden. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/footer_logo.svg"
        alt=""
        aria-hidden="true"
        className="mt-space-2xl w-full"
      />
    </footer>
  );
};
