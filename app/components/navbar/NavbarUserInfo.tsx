"use client";

import { User } from "@/features/auth/models";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { Typography } from "@/shared/ui/Typography";
import { FC } from "react";

interface Props {
  user: User;
}

const NavbarUserInfo: FC<Props> = ({ user }) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar src={""} name={user.name} />
      <Typography.Text size={20}>{user.name}</Typography.Text>
    </div>
  );
};

export default NavbarUserInfo;
