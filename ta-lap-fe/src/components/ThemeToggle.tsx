"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredTheme, toggleTheme as switchTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDarkMode(getStoredTheme() === "dark");
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next = switchTheme();
    setDarkMode(next === "dark");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle tema"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 dark:border-white/10 dark:bg-white/5"
      >
        <Sun size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="
        flex h-10 w-10 items-center justify-center rounded-xl border
        border-gray-200 bg-white text-gray-600 shadow-sm transition
        hover:border-cyan-300 hover:text-cyan-600
        dark:border-white/10 dark:bg-white/5 dark:text-gray-300
        dark:hover:border-cyan-400/40 dark:hover:text-cyan-400
      "
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
