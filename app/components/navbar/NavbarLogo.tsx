import { FC } from "react";
import Image from "next/image";

const NavbarLogo: FC = () => {
  return (
    <Image
      src="/logo.svg"
      alt="Рявхаб"
      width={133}
      height={29}
      className="h-auto"
    />
  );
};

export default NavbarLogo;
