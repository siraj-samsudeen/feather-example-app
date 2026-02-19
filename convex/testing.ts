import { mutation } from "./_generated/server";
import schema from "./schema";

const allTables = Object.keys(schema.tables);

export const clearAll = mutation({
  handler: async (ctx) => {
    for (const table of allTables) {
      const docs = await ctx.db.query(table as any).collect();
      await Promise.all(docs.map((doc: any) => ctx.db.delete(doc._id)));
    }
  },
});
