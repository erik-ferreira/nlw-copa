import { ReactNode } from "react";
import { AuthProvider } from "../hooks/useAuth";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
