import {
  useEffect,
  useState,
} from "react";

import type {
  Theme,
} from "./useTheme";

import { ThemeContext } from "./theme-context";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>(() => {
      return (
        (localStorage.getItem(
          "theme"
        ) as Theme) || "light"
      );
    });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem(
      "theme",
      theme
    );
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) =>
      prev === "light"
        ? "dark"
        : "light"
    );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}