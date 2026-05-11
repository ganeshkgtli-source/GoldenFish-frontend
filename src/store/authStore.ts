import { create } from "zustand";

import { persist } from "zustand/middleware";

type User = {
  username: string;

  role: string;
  email: string;
  is_kyc_verified: boolean;
};

type AuthState = {
  user: User | null;

  isAuthenticated: boolean;

  setUser: (user: User) => void;

  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,

          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,

          isAuthenticated: false,
        }),
    }),

    {
      name: "auth-storage",
    },
  ),
);
