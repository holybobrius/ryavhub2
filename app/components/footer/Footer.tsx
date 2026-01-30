import { NavMenu } from "@/shared/ui/NavMenu/NavMenu";
import { Typography } from "@/shared/ui/Typography";
import Image from "next/image";

interface Props {
  showNavMenu?: boolean;
}

export const Footer = ({ showNavMenu }: Props) => {
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

  return (
    <div className="h-74.5 bg-primary flex justify-center px-15 pt-13 pb-8 relative overflow-hidden items-start">
      <div className="w-full flex justify-between z-10">
        {showNavMenu ? <NavMenu items={items} color="light" /> : <></>}
        <Typography.Text className="text-text-surface" size={16}>
          © 2021-2026
        </Typography.Text>
      </div>
      <Image
        src="/footer-logo.svg"
        alt="Рявхаб"
        width={1800}
        height={1800}
        className="h-auto w-auto absolute top-13 left-15"
      />
    </div>
  );
};
