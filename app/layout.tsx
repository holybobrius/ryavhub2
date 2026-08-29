import "./globals.css";
import Link from "next/link";
import { geologica, ptRootUI } from "./fonts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { AuthProvider } from "@/lib/providers/AuthProvider";

dayjs.extend(utc);
dayjs.locale("ru");

// Layout читает cookies() для auth, поэтому весь сайт рендерится на каждый
// запрос. Объявляем это явно, чтобы Next не пытался пререндерить страницы
// в статику на этапе build.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="ru" className={`${geologica.variable} ${ptRootUI.variable}`}>
      <body>
        <AuthProvider user={user ?? null}>
          {/* Временная навигация до появления дизайн-системы */}
          <nav className="flex gap-24 px-40 py-16 text-body-md text-nav-link-text-default">
            <Link href="/">Главная</Link>
            <Link href="/quotes">Цитаты</Link>
            <Link href="/timeline">Таймлайн</Link>
            <Link href="/saves">Сейвы</Link>
            {user && <span className="ml-auto">{user.name}</span>}
          </nav>
          <main className="px-40 py-32">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
