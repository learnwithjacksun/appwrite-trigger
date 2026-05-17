import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => Boolean(get().token),
    }),
    { name: "auth-storage" },
  ),
);
