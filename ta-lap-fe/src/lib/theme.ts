const THEME_KEY = "talap-theme";

export type ThemeMode = "light" | "dark";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const legacy = localStorage.getItem("theme");
  if (legacy === "light" || legacy === "dark") {
    applyTheme(legacy);
    return legacy;
  }
  return "dark";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem(THEME_KEY, mode);
}

export function initTheme() {
  applyTheme(getStoredTheme());
}

export function toggleTheme(): ThemeMode {
  const next = getStoredTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
