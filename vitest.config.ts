import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.tsx"],
    globals: true,
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["app/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/.next/**"],
    },
  },
});
