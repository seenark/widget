import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new ConvexError({
        data: {
          message: "Not Authenticated",
        },
      });
      // throw new Error("Not Authenticated");
    }

    const userId = await ctx.db.insert("users", { name: "HadesGod" });
    return userId;
  },
});
