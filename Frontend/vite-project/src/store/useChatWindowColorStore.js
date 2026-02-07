import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatWindowColorStore = create(
  persist(
    (set) => ({
      chatWindowColor: "default",
      
      setChatWindowColor: (color) => {
        // Apply color to chat window
        const root = document.documentElement;
        
        const colors = {
          default: {
            bg: "#0f172a",
            text: "#f8fafc",
            header: "#1e293b",
            message: "#1e293b",
          },
          ocean: {
            bg: "#0c2340",
            text: "#e0f2fe",
            header: "#0f3460",
            message: "#164863",
          },
          forest: {
            bg: "#1a3a2a",
            text: "#d0f0d0",
            header: "#2d5a3d",
            message: "#1e5631",
          },
          sunset: {
            bg: "#3d2417",
            text: "#ffd4a3",
            header: "#5c3d2e",
            message: "#8b4513",
          },
          purple: {
            bg: "#2d1b4e",
            text: "#e9d5ff",
            header: "#4c1d95",
            message: "#5b21b6",
          },
          pink: {
            bg: "#3d1f2f",
            text: "#fbcfe8",
            header: "#5e1f3a",
            message: "#be123c",
          },
          midnight: {
            bg: "#0a0e27",
            text: "#f0f4ff",
            header: "#1a1f3a",
            message: "#2d3561",
          },
        };

        const selectedColor = colors[color] || colors.default;
        
        root.style.setProperty("--chat-bg", selectedColor.bg);
        root.style.setProperty("--chat-text", selectedColor.text);
        root.style.setProperty("--chat-header", selectedColor.header);
        root.style.setProperty("--chat-message", selectedColor.message);
        
        set({ chatWindowColor: color });
      },
    }),
    {
      name: "chat-window-color-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setChatWindowColor(state.chatWindowColor);
        }
      },
    }
  )
);
