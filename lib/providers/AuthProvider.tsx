"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { AuthState, AuthStore, createAuthStore } from "@/lib/stores/authStore";
import { User } from "@/features/auth/models";
import { useStore } from "zustand";

const AuthStoreCtx = createContext<AuthStore | undefined>(undefined);

interface Props {
  user: User | null;
  children: React.ReactNode;
}

export const AuthProvider = ({ user, children }: Props) => {
  const storeRef = useRef<AuthStore>(null);
  storeRef.current ??= createAuthStore();

  useEffect(() => {
    storeRef.current?.getState().setUser(user);
  }, [user]);

  return <AuthStoreCtx value={storeRef.current}>{children}</AuthStoreCtx>;
};

export const useAuthStore = <T,>(selector: (state: AuthState) => T) => {
  const store = useContext(AuthStoreCtx);
  if (!store) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return useStore(store, selector);
};
