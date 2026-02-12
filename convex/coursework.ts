import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List coursework for a given user, optionally filtered by Google Course ID.
 * Results are sorted by updatedAt descending (most recent first).
 */
export const listCoursework = query({
  args: {
    userId: v.id("users"),
    googleCourseId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.googleCourseId !== undefined) {
      // Filter by specific course
      results = await ctx.db
        .query("coursework")
        .withIndex("by_googleCourseId_userId", (q) =>
          q
            .eq("googleCourseId", args.googleCourseId!)
            .eq("userId", args.userId)
        )
        .collect();
    } else {
      // All coursework for user
      results = await ctx.db
        .query("coursework")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();
    }

    // Sort by updatedAt descending
    results.sort((a, b) => b.updatedAt - a.updatedAt);
    return results;
  },
});

/**
 * Get a single coursework item by its Google Coursework ID and user.
 */
export const getCoursework = query({
  args: {
    googleCourseworkId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("coursework")
      .withIndex("by_googleCourseworkId_userId", (q) =>
        q
          .eq("googleCourseworkId", args.googleCourseworkId)
          .eq("userId", args.userId)
      )
      .first();
    return item;
  },
});
