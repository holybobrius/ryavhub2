import { render } from "@testing-library/react";
import React from "react";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import type { User } from "@/features/auth/models";

interface Options {
  authUser?: User | null;
}

export function renderWithProviders(ui: React.ReactElement, options?: Options) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthProvider user={options?.authUser ?? null}>{children}</AuthProvider>
    );
  };
  return render(ui, { wrapper: Wrapper });
}
