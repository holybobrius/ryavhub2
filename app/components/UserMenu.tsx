"use client";

import { useRouter } from "next/navigation";
import { Dropdown } from "@/shared/ui/Dropdown";
import type { DropdownItem } from "@/shared/ui/Dropdown";
import { Avatar } from "@/shared/ui/Avatar";
import type { User } from "@/features/auth/models";
import "./user-menu.css";

export const UserMenu = ({ user }: { user: User }) => {
  const router = useRouter();

  const menu: DropdownItem[] = [
    // TODO: роут /profile ещё не создан.
    { label: "Профиль", onClick: () => router.push("/profile") },

    // TODO: логаут не реализован — нет эндпоинта очистки сессии.
    { label: "Выйти", onClick: () => {} },
  ];

  return (
    <Dropdown
      className="user-menu"
      size="sm"
      variant="soft"
      tone="tertiary"
      leftIcon={<Avatar size={20} shape="square" />}
      menu={menu}
    >
      {user.name}
    </Dropdown>
  );
};
