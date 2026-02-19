import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  webServer: {
    command: "npm run dev:frontend",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: "http://localhost:5173",
    screenshot: "only-on-failure",
  },

  // Serial execution: tests share a single Convex DB instance.
  // Do NOT parallelize without per-test DB isolation.
  workers: 1,
});
