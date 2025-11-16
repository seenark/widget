import type { GenericQueryCtx } from "convex/server";
import { ConvexError } from "convex/values";
import type { DataModel, Id } from "./_generated/dataModel";

export const getUserId = async (ctx: GenericQueryCtx<DataModel>) => {
  const user = await ctx.auth.getUserIdentity();
  console.log({ user });
  if (user === null) {
    throw new ConvexError({
      data: {
        message: "User not authenticated",
      },
    });
  }
  const userSubject = user.subject.split("|");
  const userId = userSubject[0] as Id<"users">;
  return userId;
};
