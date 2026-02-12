import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List private comments for a given user, optionally filtered by Google Submission ID.
 * Results are sorted by createdAt descending (most recent first).
 */
export const listComments = query({
  args: {
    userId: v.id("users"),
    googleSubmissionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.googleSubmissionId !== undefined) {
      results = await ctx.db
        .query("privateComments")
        .withIndex("by_googleSubmissionId_userId", (q) =>
          q
            .eq("googleSubmissionId", args.googleSubmissionId!)
            .eq("userId", args.userId)
        )
        .collect();
    } else {
      results = await ctx.db
        .query("privateComments")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();
    }

    // Sort by createdAt descending
    results.sort((a, b) => b.createdAt - a.createdAt);
    return results;
  },
});

/**
 * Get all private comments for a specific submission and user.
 * Sorted by createdAt descending.
 */
export const getCommentsForSubmission = query({
  args: {
    googleSubmissionId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("privateComments")
      .withIndex("by_googleSubmissionId_userId", (q) =>
        q
          .eq("googleSubmissionId", args.googleSubmissionId)
          .eq("userId", args.userId)
      )
      .collect();

    results.sort((a, b) => b.createdAt - a.createdAt);
    return results;
  },
});
