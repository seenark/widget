import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { GenericCtx } from "./_generated/server";

export const getUserId = async (ctx: GenericCtx) => {
  const user = await ctx.auth.getUserIdentity();
  console.log({ user });
  if (user === null) {
    throw new ConvexError({
      data: {
        message: "User not authenticated",
      },
    });
  }
  const userId = user.subject as Id<"users">;
  return userId;
};
