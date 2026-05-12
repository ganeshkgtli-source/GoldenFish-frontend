import { useContext } from "react";

import { ThemeContext } from "./theme-context";

export type Theme =
  | "light"
  | "dark";

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useTheme =
  (): ThemeContextType => {
    const ctx =
      useContext(ThemeContext);

    if (!ctx) {
      throw new Error(
        "useTheme must be used inside ThemeProvider"
      );
    }

    return ctx;
  };