import { useAuthStore } from "@/lib/stores/authStore";

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);

  return {
    user,
    isAuthenticated: !!user,
  };
};
