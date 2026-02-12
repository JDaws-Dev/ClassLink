import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Mark an item as seen by upserting a seenState record.
 * If a seenState already exists for (userId, itemType, itemGoogleId), update its seenAt.
 * Otherwise, insert a new record.
 */
export const markSeen = mutation({
  args: {
    userId: v.id("users"),
    itemType: v.string(),
    itemGoogleId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("seenStates")
      .withIndex("by_userId_itemType_itemGoogleId", (q) =>
        q
          .eq("userId", args.userId)
          .eq("itemType", args.itemType)
          .eq("itemGoogleId", args.itemGoogleId)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { seenAt: now });
      return existing._id;
    }

    const id = await ctx.db.insert("seenStates", {
      userId: args.userId,
      itemType: args.itemType,
      itemGoogleId: args.itemGoogleId,
      seenAt: now,
    });
    return id;
  },
});

/**
 * Get all seen states for a user.
 */
export const getSeenStates = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const states = await ctx.db
      .query("seenStates")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return states;
  },
});
