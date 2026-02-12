import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    googleSub: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    createdAt: v.number(),
  })
    .index("by_googleSub", ["googleSub"])
    .index("by_email", ["email"]),

  tokens: defineTable({
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
  }).index("by_userId", ["userId"]),

  courses: defineTable({
    googleCourseId: v.string(),
    userId: v.id("users"),
    name: v.string(),
    section: v.string(),
    teacherName: v.string(),
    enrollmentCode: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_googleCourseId_userId", ["googleCourseId", "userId"]),

  coursework: defineTable({
    googleCourseworkId: v.string(),
    googleCourseId: v.string(),
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    dueDate: v.optional(v.string()),
    alternateLink: v.string(),
    courseWorkType: v.string(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_googleCourseId_userId", ["googleCourseId", "userId"])
    .index("by_googleCourseworkId_userId", ["googleCourseworkId", "userId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"]),

  submissions: defineTable({
    googleSubmissionId: v.string(),
    googleCourseworkId: v.string(),
    userId: v.id("users"),
    state: v.string(),
    assignedGrade: v.optional(v.number()),
    alternateLink: v.string(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_googleCourseworkId_userId", ["googleCourseworkId", "userId"])
    .index("by_googleSubmissionId_userId", ["googleSubmissionId", "userId"]),

  privateComments: defineTable({
    googleCommentId: v.string(),
    googleSubmissionId: v.string(),
    userId: v.id("users"),
    author: v.string(),
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_googleSubmissionId_userId", ["googleSubmissionId", "userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  seenStates: defineTable({
    userId: v.id("users"),
    itemType: v.string(),
    itemGoogleId: v.string(),
    seenAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_itemType_itemGoogleId", [
      "userId",
      "itemType",
      "itemGoogleId",
    ]),

  syncStates: defineTable({
    userId: v.id("users"),
    lastSyncAt: v.number(),
  }).index("by_userId", ["userId"]),
});
