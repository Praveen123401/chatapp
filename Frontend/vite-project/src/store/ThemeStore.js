import { create } from "zustand";
import { persist } from "zustand/middleware";

let systemMediaQuery = null;
let systemListener = null;

const applySystemTheme = () => {
  if (typeof window === "undefined") return;
  systemMediaQuery = systemMediaQuery || window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = systemMediaQuery.matches;
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (newTheme) => {
        if (newTheme === "system") {
          applySystemTheme();
          if (typeof window !== "undefined") {
            systemMediaQuery = systemMediaQuery || window.matchMedia("(prefers-color-scheme: dark)");
            if (!systemListener) {
              systemListener = () => applySystemTheme();
              systemMediaQuery.addEventListener("change", systemListener);
            }
          }
        } else {
          if (systemMediaQuery && systemListener) {
            systemMediaQuery.removeEventListener("change", systemListener);
            systemListener = null;
          }
          document.documentElement.setAttribute("data-theme", newTheme);
        }

        set({ theme: newTheme });
        document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
      },
    }),
    {
      name: "chat-theme-storage",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.theme === "system") {
          applySystemTheme();
          if (typeof window !== "undefined") {
            systemMediaQuery = systemMediaQuery || window.matchMedia("(prefers-color-scheme: dark)");
            if (!systemListener) {
              systemListener = () => applySystemTheme();
              systemMediaQuery.addEventListener("change", systemListener);
            }
          }
        } else {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);
