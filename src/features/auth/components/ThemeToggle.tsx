import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  variant?: "floating" | "inline";
}

export default function ThemeToggle({ variant = "floating" }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${variant === "floating" ? "fixed top-6 right-6 z-50 w-12 h-12 shadow-lg" : "w-10 h-10"}
        rounded-full 
        bg-white dark:bg-slate-800 
        border border-slate-200 dark:border-slate-700 
        flex items-center justify-center
        hover:scale-105 transition-all
      `}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
}