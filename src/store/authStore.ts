import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/auth";

type User = {
  username: string;
  email?: string;
  role?: Role;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
}

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

      // 🔥 ADD THIS
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,

//       setUser: (user) =>
//         set({
//           user,
//           isAuthenticated: true,
//         }),

//       clearUser: () =>
//         set({
//           user: null,
//           isAuthenticated: false,
//         }),
//     }),
//     {
//       name: "auth-storage", // localStorage key
//     }
//   )
// );