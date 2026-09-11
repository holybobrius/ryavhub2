import { User } from "@/features/auth/models";
import { createStore } from "zustand";

export type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = () =>
  createStore<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }));
