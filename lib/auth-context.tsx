"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = { name: string; email: string } | null;

type AuthContextType = {
  user: User;
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Load saved session on first render
  // TODO: replace with a real session check (NextAuth, Supabase, cookie + API call)
  useEffect(() => {
    const saved = localStorage.getItem("cnf_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (u: { name: string; email: string }) => {
    setUser(u);
    localStorage.setItem("cnf_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cnf_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}