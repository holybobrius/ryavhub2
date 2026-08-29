import "./globals.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { AuthProvider } from "@/lib/providers/AuthProvider";

dayjs.extend(utc);
dayjs.locale("ru");

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="ru">
      <body>
        <AuthProvider user={user ?? null}>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
