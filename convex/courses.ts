import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all courses for a given user.
 */
export const listCourses = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return courses;
  },
});

/**
 * Get a single course by its Google Course ID and user.
 */
export const getCourse = query({
  args: {
    googleCourseId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_googleCourseId_userId", (q) =>
        q.eq("googleCourseId", args.googleCourseId).eq("userId", args.userId)
      )
      .first();
    return course;
  },
});
