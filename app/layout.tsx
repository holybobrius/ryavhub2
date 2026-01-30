import { Geologica } from "next/font/google";
import { Unbounded } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import "./globals.css";
import "../styles/theme.css";
import { Footer } from "./components/footer/Footer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { AuthProvider } from "@/lib/providers/AuthProvider";

dayjs.extend(utc);
dayjs.locale("ru");

const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geologica.variable} ${unbounded.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider user={user || null}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer showNavMenu={!!user} />
        </AuthProvider>
      </body>
    </html>
  );
}
