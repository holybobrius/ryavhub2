"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { User } from "@/features/auth/models";

interface Props {
  user: User | null;
  children: React.ReactNode;
}

export const AuthProvider = ({ user, children }: Props) => {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return children;
};
