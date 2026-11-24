import { useEffect, useState, type ReactNode } from "react";
import { type ApiUser, loginApi, getMeApi } from "@/lib/api";
import { AuthContext, TOKEN_KEY, USER_KEY } from "@/contexts/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMeApi();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        } else {
          logout();
        }
      } catch (err) {
        console.warn("Session verification failed, logging out:", err);
        logout();
      } finally {
        setLoading(false);
      }
    }

    verifyAuth();
  }, []);

  const setSession = (newToken: string, newUser: ApiUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const login = async (email: string, pass: string) => {
    const res = await loginApi(email, pass);
    if (res.success && res.token && res.user) {
      setSession(res.token, res.user);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
