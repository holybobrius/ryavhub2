import "./globals.css";
import { geologica, ptRootUI } from "./fonts";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
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
          <Navbar user={user ?? null} />
          {/* Фон контента на ступень светлее страницы/навбара (bg-page),
              чтобы визуально отделить основную область. */}
          <main className="min-h-screen bg-surface-bg-layout px-page-margin pb-inset-xl">
            {children}
          </main>
          <Footer user={user ?? null} />
        </AuthProvider>
      </body>
    </html>
  );
}
