// =============================================================================
// ClassLink - Google Classroom API Module (Placeholder)
// =============================================================================
// This module provides typed wrappers around the Google Classroom REST API.
// Currently stubbed with mock data for development.
//
// Required environment variables:
//   GOOGLE_CLIENT_ID     - OAuth 2.0 Client ID from Google Cloud Console
//   GOOGLE_CLIENT_SECRET - OAuth 2.0 Client Secret from Google Cloud Console
//
// Required OAuth scopes (requested during sign-in):
//   - https://www.googleapis.com/auth/classroom.courses.readonly
//   - https://www.googleapis.com/auth/classroom.coursework.me.readonly
//   - https://www.googleapis.com/auth/classroom.student-submissions.me.readonly
//   - https://www.googleapis.com/auth/classroom.rosters.readonly
//
// Google Classroom API reference:
//   https://developers.google.com/classroom/reference/rest
// =============================================================================

import {
  MOCK_COURSES,
  MOCK_INBOX_ITEMS,
  MOCK_COMMENT_THREADS,
  type Course,
  type InboxItem,
  type CommentThread,
} from "./mock-data";

// ---------------------------------------------------------------------------
// Types for API responses
// ---------------------------------------------------------------------------

export interface ClassroomCourse {
  id: string;
  name: string;
  section: string;
  ownerId: string;
  courseState: "ACTIVE" | "ARCHIVED" | "PROVISIONED" | "DECLINED" | "SUSPENDED";
  alternateLink: string;
}

export interface CourseWork {
  id: string;
  courseId: string;
  title: string;
  description: string;
  state: "PUBLISHED" | "DRAFT" | "DELETED";
  alternateLink: string;
  dueDate?: { year: number; month: number; day: number };
  dueTime?: { hours: number; minutes: number };
  maxPoints: number;
  workType: "ASSIGNMENT" | "SHORT_ANSWER_QUESTION" | "MULTIPLE_CHOICE_QUESTION";
  creationTime: string;
  updateTime: string;
}

export interface StudentSubmission {
  id: string;
  courseId: string;
  courseWorkId: string;
  userId: string;
  state: "NEW" | "CREATED" | "TURNED_IN" | "RETURNED" | "RECLAIMED_BY_STUDENT";
  assignedGrade?: number;
  alternateLink: string;
  late: boolean;
  creationTime: string;
  updateTime: string;
}

export interface SubmissionComment {
  id: string;
  text: string;
  author: string;
  creationTime: string;
}

export interface SyncResult {
  synced: boolean;
  newItems: number;
  updatedItems: number;
  courses: Course[];
  inboxItems: InboxItem[];
  lastSyncAt: number;
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/**
 * List all active courses for the authenticated student.
 *
 * TODO: Replace with real Google Classroom API call:
 *   GET https://classroom.googleapis.com/v1/courses
 *   ?studentId=me&courseStates=ACTIVE
 *   Headers: Authorization: Bearer {accessToken}
 *
 * @param accessToken - OAuth 2.0 access token for the student
 * @returns Array of courses the student is enrolled in
 */
export async function listStudentCourses(
  accessToken: string
): Promise<Course[]> {
  // TODO: Replace with real Google Classroom API call
  // const response = await fetch(
  //   "https://classroom.googleapis.com/v1/courses?studentId=me&courseStates=ACTIVE",
  //   { headers: { Authorization: `Bearer ${accessToken}` } }
  // );
  // const data = await response.json();
  // return data.courses.map(mapCourseToInternal);

  console.log("[google-classroom] listStudentCourses called (returning mock data)");
  return MOCK_COURSES;
}

/**
 * List all coursework (assignments, questions) for a specific course.
 *
 * TODO: Replace with real Google Classroom API call:
 *   GET https://classroom.googleapis.com/v1/courses/{courseId}/courseWork
 *   ?orderBy=dueDate asc
 *   Headers: Authorization: Bearer {accessToken}
 *
 * @param accessToken - OAuth 2.0 access token for the student
 * @param courseId - The ID of the course to list work for
 * @returns Array of coursework items
 */
export async function listCourseWork(
  accessToken: string,
  courseId: string
): Promise<CourseWork[]> {
  // TODO: Replace with real Google Classroom API call
  // const response = await fetch(
  //   `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork?orderBy=dueDate%20asc`,
  //   { headers: { Authorization: `Bearer ${accessToken}` } }
  // );
  // const data = await response.json();
  // return data.courseWork || [];

  console.log(`[google-classroom] listCourseWork called for course ${courseId} (returning mock data)`);

  // Return mock coursework items derived from inbox items for this course
  const courseItems = MOCK_INBOX_ITEMS.filter(
    (item) => item.courseId === courseId && item.type === "assignment"
  );

  return courseItems.map((item) => ({
    id: item.googleItemId,
    courseId: item.courseId,
    title: item.title,
    description: item.description,
    state: "PUBLISHED" as const,
    alternateLink: item.alternateLink,
    maxPoints: 100,
    workType: "ASSIGNMENT" as const,
    creationTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  }));
}

/**
 * Get the authenticated student's submission for a specific coursework item.
 *
 * TODO: Replace with real Google Classroom API call:
 *   GET https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions
 *   ?userId=me
 *   Headers: Authorization: Bearer {accessToken}
 *
 * @param accessToken - OAuth 2.0 access token for the student
 * @param courseId - The course ID
 * @param courseWorkId - The coursework item ID
 * @returns The student's submission object
 */
export async function getStudentSubmission(
  accessToken: string,
  courseId: string,
  courseWorkId: string
): Promise<StudentSubmission> {
  // TODO: Replace with real Google Classroom API call
  // const response = await fetch(
  //   `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions?userId=me`,
  //   { headers: { Authorization: `Bearer ${accessToken}` } }
  // );
  // const data = await response.json();
  // return data.studentSubmissions?.[0];

  console.log(
    `[google-classroom] getStudentSubmission called for ${courseId}/${courseWorkId} (returning mock data)`
  );

  return {
    id: `sub-${courseWorkId}`,
    courseId,
    courseWorkId,
    userId: "me",
    state: "CREATED",
    alternateLink: `https://classroom.google.com/c/${courseId}/a/${courseWorkId}/submissions`,
    late: false,
    creationTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  };
}

/**
 * List private comments on a student's submission.
 *
 * TODO: Replace with real Google Classroom API call:
 *   GET https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{submissionId}/comments
 *   Headers: Authorization: Bearer {accessToken}
 *
 * Note: The Classroom API does not have a direct "comments" endpoint for
 * private comments. In practice, we may need to use the Drive API to read
 * comments on the student's Google Doc/Slides submission, or poll the
 * "courseWork.studentSubmissions" endpoint for changes in the submission's
 * history field.
 *
 * @param accessToken - OAuth 2.0 access token
 * @param courseId - The course ID
 * @param courseWorkId - The coursework item ID
 * @param submissionId - The submission ID
 * @returns Array of comment threads
 */
export async function listSubmissionComments(
  accessToken: string,
  courseId: string,
  courseWorkId: string,
  submissionId: string
): Promise<CommentThread[]> {
  // TODO: Replace with real Google Classroom API call
  // This may require the Drive API for document-level comments,
  // or using the Classroom API's announcements/topics endpoint for
  // class-level comments.

  console.log(
    `[google-classroom] listSubmissionComments called for ${courseId}/${courseWorkId}/${submissionId} (returning mock data)`
  );

  // Find matching inbox item and return its comments
  const inboxItem = MOCK_INBOX_ITEMS.find(
    (item) =>
      item.courseId === courseId && item.googleItemId === courseWorkId
  );

  if (inboxItem && MOCK_COMMENT_THREADS[inboxItem.id]) {
    return MOCK_COMMENT_THREADS[inboxItem.id];
  }

  return [];
}

/**
 * Perform a full sync of classroom data for the authenticated student.
 * This is the main function called by the /api/sync endpoint.
 *
 * TODO: Replace with real Google Classroom API calls.
 *
 * Real sync algorithm:
 *   1. Call listStudentCourses() to get all active courses
 *   2. For each course, call listCourseWork() to get assignments
 *   3. For each coursework item, call getStudentSubmission() to check status
 *   4. Compare fetched data with stored data in Convex to find:
 *      - New assignments that aren't in the database yet
 *      - Updated submissions (new grades, state changes)
 *      - New private comments
 *   5. Batch-write new/updated items to Convex
 *   6. Update the user's syncState with the new lastSyncAt timestamp
 *   7. Return a summary of what changed
 *
 * @param accessToken - OAuth 2.0 access token for the student
 * @returns Sync result with counts of new/updated items
 */
export async function syncClassroomData(
  accessToken: string
): Promise<SyncResult> {
  // TODO: Replace with real Google Classroom API calls and Convex mutations
  //
  // const courses = await listStudentCourses(accessToken);
  // let newItems = 0;
  // let updatedItems = 0;
  //
  // for (const course of courses) {
  //   const courseWork = await listCourseWork(accessToken, course.id);
  //   for (const work of courseWork) {
  //     const submission = await getStudentSubmission(accessToken, course.id, work.id);
  //     const existing = await convex.query("inboxItems:getByCourseWorkId", { courseWorkId: work.id });
  //     if (!existing) {
  //       await convex.mutation("inboxItems:create", { ... });
  //       newItems++;
  //     } else if (existing.updatedAt < submission.updateTime) {
  //       await convex.mutation("inboxItems:update", { ... });
  //       updatedItems++;
  //     }
  //   }
  // }

  console.log("[google-classroom] syncClassroomData called (returning mock data)");

  // Simulate a brief network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    synced: true,
    newItems: 3,
    updatedItems: 1,
    courses: MOCK_COURSES,
    inboxItems: MOCK_INBOX_ITEMS,
    lastSyncAt: Date.now(),
  };
}

/**
 * Build a deep link URL to a specific item in Google Classroom.
 * This constructs the URL that opens the item directly in Google Classroom
 * when the student clicks "Open in Classroom".
 *
 * @param courseId - The course ID
 * @param courseWorkId - Optional coursework item ID (for assignment links)
 * @returns Full Google Classroom URL
 */
export function buildClassroomDeepLink(
  courseId: string,
  courseWorkId?: string
): string {
  const baseUrl = "https://classroom.google.com";

  if (courseWorkId) {
    return `${baseUrl}/c/${courseId}/a/${courseWorkId}/details`;
  }

  return `${baseUrl}/c/${courseId}`;
}
