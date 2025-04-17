// stores/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type UserDataType, loginApi } from "@/api/login";

type UserState = {
  user?: UserDataType;
  token?: string;
};

type UserActions = {
  setUserData: (data: UserDataType) => void;
  setToken: (token: string) => void;
  logout: () => void;
  resetUser: () => void;
};

const defaultUserState: UserState = {
  user: undefined,
  token: undefined,
};

export const userStore = create<UserState & UserActions>()(
  persist(
    immer((set) => ({
      ...defaultUserState,

      setUserData: (data: UserDataType) => {
        set((state) => {
          state.user = data;
        });
      },

      setToken: (token: string) => {
        set((state) => {
          state.token = token;
        });
      },

      logout: async () => {
        try {
          await loginApi.logout();
          set(defaultUserState);
        } catch (error) {
          throw error;
        }
      },
      resetUser: () => {
        set(defaultUserState);
      },
    })),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
