"use client";

import { useContext} from "react";
import { ThemeContext } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
 

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 "
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-800 transition duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-black/70 transition duration-300" />
      )}
    </button>
  );
}
