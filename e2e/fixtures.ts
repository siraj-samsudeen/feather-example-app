import { test as featherTest } from "feather-testing-core/playwright";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const convexUrl = process.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "VITE_CONVEX_URL not set. Run `npx convex dev --local` to generate .env.local",
  );
}

const client = new ConvexHttpClient(convexUrl);

export const test = featherTest.extend<{ _cleanup: void }>({
  _cleanup: [
    async ({}, use) => {
      await use();
      await client.mutation(api.testing.clearAll);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
