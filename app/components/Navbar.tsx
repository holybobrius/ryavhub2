import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { IconChevronRight } from "@/shared/ui/icons";
import type { User } from "@/features/auth/models";
import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";
import { NAV_ITEMS } from "./navItems";

interface NavbarProps {
  user: User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  return (
    <header className="flex items-center justify-between bg-surface-bg-page px-page-margin py-inset-2xs">
      <div className="flex items-center gap-space-2xl">
        <Link
          href="/"
          aria-label="ryav.hub — на главную"
          className="inline-flex"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="ryav.hub"
            style={{ height: 24, width: "auto" }}
          />
        </Link>

        {user && (
          <nav className="flex items-center gap-space-xl">
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
};
