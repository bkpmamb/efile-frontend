"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface UserType {
  name: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (userData: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    type CookieObject = Record<string, string>;

    const cookies: CookieObject = document.cookie
      .split("; ")
      .reduce((acc: CookieObject, c: string) => {
        const [key, value] = c.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});

    if (cookies.username && cookies.name && cookies.role) {
      queueMicrotask(() => {
        setUser({
          username: cookies.username,
          name: cookies.name,
          role: cookies.role,
        });
        setIsAuthenticated(true);
      });
    }
  }, []);

  const login = (userData: UserType) => {
    // Simpan cookie
    document.cookie = `username=${userData.username}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `name=${userData.name}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `role=${userData.role}; path=/; max-age=86400; SameSite=Lax`;

    setUser(userData);
    setIsAuthenticated(true);

    router.push("/dashboard");
  };

  const logout = () => {
    // Hapus cookie
    document.cookie = "username=; path=/; max-age=0";
    document.cookie = "name=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";

    setUser(null);
    setIsAuthenticated(false);

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return ctx;
}
