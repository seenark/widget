import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./helpers";

export const getOwnerOfOrganization = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return ctx.db
      .query("organizations")
      .withIndex("ownerUserId", (q) => q.eq("ownerUserId", userId))
      .first();
  },
});

export const createOrganization = mutation({
  args: {
    name: v.string(),
    userLimit: v.optional(v.number()),
  },
  handler: async (ctx, { name, userLimit }) => {
    const userId = await getUserId(ctx);
    const orgId = await ctx.db.insert("organizations", {
      ownerUserId: userId,
      name,
      userLimit: userLimit || 1,
    });

    return {
      orgId,
    };
  },
});
