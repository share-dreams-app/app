import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/auth.ts", "src/app/api/**/*.ts", "src/domain/**/*.ts", "src/server/**/*.ts"],
      exclude: ["src/app/api/health/**", "src/domain/types.ts", "src/lib/**", "src/server/repositories/**"],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
          lines: 90
        }
      }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
