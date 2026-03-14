import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.test.{js,jsx}", "src/**/*.spec.{js,jsx}", "src/main.jsx", "src/i18n.js"],
      // Objectiu 70% (Notion AC1). Ara: ~7% - anirem augmentant amb nous tests.
      thresholds: {
        lines: 5,
        functions: 5,
        branches: 5,
      },
    },
  },
});
