// src/store/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo, MenuItem } from "@/api/auth";

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  menus: MenuItem[];
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setMenus: (menus: MenuItem[]) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      menus: [],
      isAuthenticated: false,
      setToken: (token) =>
        set(() => ({
          token,
          isAuthenticated: !!token,
        })),
      setUserInfo: (userInfo) => set({ userInfo }),
      setMenus: (menus) => set({ menus }),
      reset: () =>
        set({
          token: null,
          userInfo: null,
          menus: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
