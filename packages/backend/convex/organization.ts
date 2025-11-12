import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./helpers";

export const getOrganization = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return ctx.db
      .query("organizations")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const createOrganization = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await getUserId(ctx);
    return ctx.db.insert("organizations", { userId, name });
  },
});
