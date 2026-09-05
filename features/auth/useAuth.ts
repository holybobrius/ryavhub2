import { useAuthStore } from "@/lib/providers/AuthProvider";
import { User } from "./models";

interface HookReturns {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuth = (): HookReturns => {
  const user = useAuthStore((s) => s.user);

  return { user, isAuthenticated: !!user };
};
