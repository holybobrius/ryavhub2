export interface NavItem {
  href: string;
  label: string;
}

// Пункты навигации — общие для навбара и футера.
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Главная" },
  { href: "/quotes", label: "Цитаты" },
  { href: "/timeline", label: "Таймлайн" },
  { href: "/saves", label: "Сейвы" },
  { href: "/video", label: "Видео" },
  { href: "/cringepg", label: "КринжПГ" },
];
