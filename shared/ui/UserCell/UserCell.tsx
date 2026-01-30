"use client";

import { FC } from "react";
import { Avatar } from "../Avatar/Avatar";
import { Typography } from "../Typography";

interface Props {
  userInfo: {
    name: string;
    avatarUrl?: string;
  };
  description?: string;
}

export const UserCell: FC<Props> = ({ userInfo, description }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={userInfo.avatarUrl || ""} name={userInfo.name} />
      <div className="flex flex-col">
        <Typography.Title level={6} className="text-base">
          {userInfo.name}
        </Typography.Title>
        <Typography.Text size={16} className="text-black-500">
          {description}
        </Typography.Text>
      </div>
    </div>
  );
};
