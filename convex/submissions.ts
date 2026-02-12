import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List submissions for a given user, optionally filtered by Google Coursework ID.
 */
export const listSubmissions = query({
  args: {
    userId: v.id("users"),
    googleCourseworkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.googleCourseworkId !== undefined) {
      const results = await ctx.db
        .query("submissions")
        .withIndex("by_googleCourseworkId_userId", (q) =>
          q
            .eq("googleCourseworkId", args.googleCourseworkId!)
            .eq("userId", args.userId)
        )
        .collect();
      return results;
    }

    const results = await ctx.db
      .query("submissions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return results;
  },
});

/**
 * Get a single submission by its Google Submission ID and user.
 */
export const getSubmission = query({
  args: {
    googleSubmissionId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db
      .query("submissions")
      .withIndex("by_googleSubmissionId_userId", (q) =>
        q
          .eq("googleSubmissionId", args.googleSubmissionId)
          .eq("userId", args.userId)
      )
      .first();
    return submission;
  },
});
