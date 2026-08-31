import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { IconChevronRight } from "@/shared/ui/icons";
import type { User } from "@/features/auth/models";
import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";

interface NavbarProps {
  user: User | null;
}

// Навигация показывается только авторизованному (в гостевом виде — лого + Войти).
const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/saves", label: "Сейвы" },
  { href: "/quotes", label: "Цитаты" },
  { href: "/timeline", label: "Таймлайн" },
  { href: "/video", label: "Видео" },
  { href: "/cringepg", label: "КринжПГ" },
];

/**
 * Верхний навбар приложения. Server-компонент: получает user из layout.
 * Гость: лого + кнопка «Войти». Авторизованный: лого + навигация +
 * пользовательское меню (UserMenu — клиентский Dropdown).
 */
export function Navbar({ user }: NavbarProps) {
  return (
    <header className="flex items-center justify-between bg-surface-bg-page px-60 py-8">
      <div className="flex items-center gap-40">
        <Link
          href="/"
          aria-label="ryav.hub — на главную"
          className="inline-flex"
        >
          {/* Логотип-wordmark (public/logo.svg). Нативный img — размер по высоте. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="ryav.hub"
            style={{ height: 24, width: "auto" }}
          />
        </Link>

        {user && (
          <nav className="flex items-center gap-32">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {user ? (
        <UserMenu user={user} />
      ) : (
        // TODO: привязать вход — роут /login или OAuth пока не определён.
        <Button size="sm" tone="secondary" rightIcon={<IconChevronRight />}>
          Войти
        </Button>
      )}
    </header>
  );
}
