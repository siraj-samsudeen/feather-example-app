import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import schema from "../schema";
import { modules } from "../test.setup";

describe("convex environment", () => {
  test("convex-test initializes with schema and supports CRUD", async () => {
    const t = convexTest(schema, modules);
    // Insert a user — proves the authTables schema loaded correctly.
    // If "users" table didn't exist, db.insert would throw.
    await t.run(async (ctx) => {
      await ctx.db.insert("users", { email: "test@example.com" });
    });
    const users = await t.run(async (ctx) => {
      return ctx.db.query("users").collect();
    });
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("test@example.com");
  });
});
