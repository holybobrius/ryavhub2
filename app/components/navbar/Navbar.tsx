import { FC } from "react";
import NavbarLogo from "./NavbarLogo";
import { NavMenu } from "@/shared/ui/NavMenu/NavMenu";
import { Button } from "@/shared/ui/Button/Button";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import NavbarUserInfo from "./NavbarUserInfo";

const items = [
  {
    label: "Главная",
    href: "/",
  },
  {
    label: "Цитаты",
    href: "/quotes",
  },
  {
    label: "Таймлайн",
    href: "/timeline",
  },
  {
    label: "Сейвы",
    href: "/saves",
  },
  {
    label: "КринжПГ",
    href: "/cringepg",
  },
];

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center justify-between bg-black-950 px-15 py-4.5 h-16">
      <div className="flex items-center gap-16">
        <NavbarLogo />
        <NavMenu items={items} color="dark" />
      </div>
      {user ? <NavbarUserInfo user={user} /> : <Button>Войти</Button>}
    </div>
  );
};

export default Navbar;
