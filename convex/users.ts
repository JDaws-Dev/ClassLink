import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get a user by their Google subject ID (unique per Google account).
 */
export const getUser = query({
  args: {
    googleSub: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.googleSub))
      .first();
    return user;
  },
});

/**
 * Create or update a user by Google subject ID.
 * If a user with the given googleSub already exists, update their fields.
 * Otherwise, insert a new user record.
 * Returns the user's Convex document ID.
 */
export const upsertUser = mutation({
  args: {
    googleSub: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.googleSub))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
      });
      return existing._id;
    }

    const id = await ctx.db.insert("users", {
      googleSub: args.googleSub,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      createdAt: Date.now(),
    });
    return id;
  },
});
