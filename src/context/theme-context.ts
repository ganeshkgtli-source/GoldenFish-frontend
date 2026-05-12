
import { createContext } from "react";

import type {
  ThemeContextType,
} from "./useTheme";

export const ThemeContext =
  createContext<ThemeContextType | null>(
    null
  );