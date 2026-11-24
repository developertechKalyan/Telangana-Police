import { createContext, useContext } from "react";
import type { ApiUser } from "@/lib/api";

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  setSession: (token: string, user: ApiUser) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TOKEN_KEY = "mppolice_auth_token";
export const USER_KEY = "mppolice_auth_user";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
