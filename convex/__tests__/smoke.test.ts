import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import schema from "../schema";
import { modules } from "../test.setup";

describe("convex environment", () => {
  test("convex-test initializes with schema", async () => {
    const t = convexTest(schema, modules);
    // Verify we can run a simple operation against the in-memory backend
    const result = await t.run(async (ctx) => {
      return ctx.db.query("users").collect();
    });
    expect(result).toEqual([]);
  });
});
