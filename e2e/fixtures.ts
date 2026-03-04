import { createConvexTest } from "feather-testing-convex/playwright";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const test = createConvexTest({
  convexUrl: process.env.VITE_CONVEX_URL!,
  clearAll: api.testing.clearAll,
});

export { expect } from "@playwright/test";
