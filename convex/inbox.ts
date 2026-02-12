import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

/**
 * Unified inbox that combines coursework, submissions, and private comments
 * into a single feed of actionable items for the student.
 */
export const getInboxItems = query({
  args: {
    userId: v.id("users"),
    filters: v.optional(
      v.object({
        courseId: v.optional(v.string()),
        showUnseenOnly: v.optional(v.boolean()),
        dueSoon: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { userId, filters } = args;

    // ---- Fetch all raw data for this user in parallel ----
    const [allCourses, allCoursework, allSubmissions, allComments, allSeen] =
      await Promise.all([
        ctx.db
          .query("courses")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .collect(),
        ctx.db
          .query("coursework")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .collect(),
        ctx.db
          .query("submissions")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .collect(),
        ctx.db
          .query("privateComments")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .collect(),
        ctx.db
          .query("seenStates")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .collect(),
      ]);

    // ---- Build lookup maps ----
    const courseMap = new Map<string, Doc<"courses">>();
    for (const course of allCourses) {
      courseMap.set(course.googleCourseId, course);
    }

    const courseworkMap = new Map<string, Doc<"coursework">>();
    for (const cw of allCoursework) {
      courseworkMap.set(cw.googleCourseworkId, cw);
    }

    const seenSet = new Map<string, number>();
    for (const seen of allSeen) {
      seenSet.set(`${seen.itemType}:${seen.itemGoogleId}`, seen.seenAt);
    }

    // Helper to check if an item is seen
    const isSeen = (itemType: string, itemGoogleId: string): boolean => {
      return seenSet.has(`${itemType}:${itemGoogleId}`);
    };

    // "Due soon" means due within the next 48 hours from now
    const now = Date.now();
    const dueSoonThreshold = now + 48 * 60 * 60 * 1000;

    // ---- Build unified inbox items ----
    type InboxItem = {
      id: string;
      type: "assignment" | "private_comment" | "returned_work";
      courseId: string;
      courseName: string;
      title: string;
      subtitle: string;
      timestamp: number;
      dueDate: string | undefined;
      isSeen: boolean;
      alternateLink: string;
      googleItemId: string;
    };

    const items: InboxItem[] = [];

    // 1) Coursework items -> "assignment" type
    for (const cw of allCoursework) {
      const course = courseMap.get(cw.googleCourseId);
      const courseName = course ? course.name : "Unknown Course";

      items.push({
        id: `assignment:${cw.googleCourseworkId}`,
        type: "assignment",
        courseId: cw.googleCourseId,
        courseName,
        title: cw.title,
        subtitle: cw.courseWorkType === "ASSIGNMENT"
          ? "Assignment"
          : cw.courseWorkType === "SHORT_ANSWER_QUESTION"
            ? "Question"
            : cw.courseWorkType === "MULTIPLE_CHOICE_QUESTION"
              ? "Multiple Choice"
              : cw.courseWorkType,
        timestamp: cw.updatedAt,
        dueDate: cw.dueDate,
        isSeen: isSeen("assignment", cw.googleCourseworkId),
        alternateLink: cw.alternateLink,
        googleItemId: cw.googleCourseworkId,
      });
    }

    // 2) Submissions with state "RETURNED" or "RECLAIMED_BY_STUDENT" -> "returned_work" type
    for (const sub of allSubmissions) {
      if (sub.state !== "RETURNED" && sub.state !== "RECLAIMED_BY_STUDENT") {
        continue;
      }
      const cw = courseworkMap.get(sub.googleCourseworkId);
      const courseId = cw ? cw.googleCourseId : "";
      const course = courseId ? courseMap.get(courseId) : undefined;
      const courseName = course ? course.name : "Unknown Course";
      const cwTitle = cw ? cw.title : "Unknown Assignment";

      const gradeText =
        sub.assignedGrade !== undefined
          ? `Grade: ${sub.assignedGrade}`
          : "Returned — no grade yet";

      items.push({
        id: `returned:${sub.googleSubmissionId}`,
        type: "returned_work",
        courseId,
        courseName,
        title: cwTitle,
        subtitle: gradeText,
        timestamp: sub.updatedAt,
        dueDate: cw ? cw.dueDate : undefined,
        isSeen: isSeen("returned_work", sub.googleSubmissionId),
        alternateLink: sub.alternateLink,
        googleItemId: sub.googleSubmissionId,
      });
    }

    // 3) Private comments -> "private_comment" type
    for (const comment of allComments) {
      // Find the parent coursework via the submission
      const parentSubmission = allSubmissions.find(
        (s) => s.googleSubmissionId === comment.googleSubmissionId
      );
      const cw = parentSubmission
        ? courseworkMap.get(parentSubmission.googleCourseworkId)
        : undefined;
      const courseId = cw ? cw.googleCourseId : "";
      const course = courseId ? courseMap.get(courseId) : undefined;
      const courseName = course ? course.name : "Unknown Course";
      const cwTitle = cw ? cw.title : "Unknown Assignment";

      items.push({
        id: `comment:${comment.googleCommentId}`,
        type: "private_comment",
        courseId,
        courseName,
        title: `Comment on: ${cwTitle}`,
        subtitle: `${comment.author}: "${comment.text.length > 80 ? comment.text.slice(0, 80) + "..." : comment.text}"`,
        timestamp: comment.createdAt,
        dueDate: cw ? cw.dueDate : undefined,
        isSeen: isSeen("private_comment", comment.googleCommentId),
        alternateLink: parentSubmission
          ? parentSubmission.alternateLink
          : "",
        googleItemId: comment.googleCommentId,
      });
    }

    // ---- Apply filters ----
    let filtered = items;

    if (filters) {
      // Filter by course
      if (filters.courseId) {
        filtered = filtered.filter(
          (item) => item.courseId === filters.courseId
        );
      }

      // Filter unseen only
      if (filters.showUnseenOnly) {
        filtered = filtered.filter((item) => !item.isSeen);
      }

      // Filter "due soon": items with a dueDate within the next 48h
      if (filters.dueSoon) {
        filtered = filtered.filter((item) => {
          if (!item.dueDate) return false;
          const dueTimestamp = new Date(item.dueDate).getTime();
          return dueTimestamp > now && dueTimestamp <= dueSoonThreshold;
        });
      }
    }

    // ---- Sort by timestamp descending ----
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    return filtered;
  },
});
