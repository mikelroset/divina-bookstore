import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

const STORAGE_KEY = "app-theme";
const THEMES = ["light", "dark", "system"];

const ThemeContext = createContext(null);

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme() {
  if (typeof window === "undefined") return "system";
  return localStorage.getItem(STORAGE_KEY) || "system";
}

function getEffectiveTheme(preference) {
  return preference === "system" ? getSystemTheme() : preference;
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState("system");
  const [effectiveTheme, setEffectiveTheme] = useState("light");

  useEffect(() => {
    const stored = getStoredTheme();
    if (THEMES.includes(stored)) {
      setPreference(stored);
      setEffectiveTheme(getEffectiveTheme(stored));
    }
  }, []);

  useEffect(() => {
    const resolved = getEffectiveTheme(preference);
    setEffectiveTheme(resolved);
  }, [preference]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [effectiveTheme]);

  useEffect(() => {
    if (preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setEffectiveTheme(getSystemTheme());
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [preference]);

  const setTheme = (value) => {
    if (!THEMES.includes(value)) return;
    setPreference(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const value = useMemo(
    () => ({ theme: preference, setTheme, effectiveTheme }),
    [preference, effectiveTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
