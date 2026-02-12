import { mutation } from "./_generated/server";

/**
 * Seeds the database with realistic mock data for development.
 * Inserts a mock student user, 4 courses, 8 coursework items,
 * submissions, private comments, and some seen states.
 *
 * Safe to call multiple times -- it checks if the mock user already exists
 * and skips seeding if data is present.
 */
export const seedMockData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if mock user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", "mock_google_sub_100201"))
      .first();

    if (existingUser) {
      return { status: "already_seeded", userId: existingUser._id };
    }

    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const ONE_HOUR = 60 * 60 * 1000;

    // ==============================
    // 1. Create mock user
    // ==============================
    const userId = await ctx.db.insert("users", {
      googleSub: "mock_google_sub_100201",
      email: "alex.johnson@student.edu",
      name: "Alex Johnson",
      avatarUrl: "https://ui-avatars.com/api/?name=Alex+Johnson&background=7C3AED&color=fff",
      createdAt: now - 30 * ONE_DAY,
    });

    // Insert a mock token record
    await ctx.db.insert("tokens", {
      userId,
      accessToken: "mock_access_token_ya29_placeholder",
      refreshToken: "mock_refresh_token_1_placeholder",
      expiresAt: now + ONE_HOUR,
    });

    // ==============================
    // 2. Create 4 courses
    // ==============================
    const courseData = [
      {
        googleCourseId: "612480135790",
        name: "Algebra 1 - Period 3",
        section: "Period 3",
        teacherName: "Mrs. Patterson",
        enrollmentCode: "abc12de",
      },
      {
        googleCourseId: "612480246801",
        name: "English Language Arts 8",
        section: "Period 5",
        teacherName: "Mr. Rivera",
        enrollmentCode: "fgh34ij",
      },
      {
        googleCourseId: "612480357912",
        name: "US History",
        section: "Period 2",
        teacherName: "Ms. Chen",
        enrollmentCode: "klm56no",
      },
      {
        googleCourseId: "612480468023",
        name: "Science 8 - Biology",
        section: "Period 6",
        teacherName: "Dr. Williams",
        enrollmentCode: "pqr78st",
      },
    ];

    const courseIds: string[] = [];
    for (const course of courseData) {
      await ctx.db.insert("courses", {
        ...course,
        userId,
      });
      courseIds.push(course.googleCourseId);
    }

    // ==============================
    // 3. Create 8 coursework items
    // ==============================
    const courseworkData = [
      // Algebra 1
      {
        googleCourseworkId: "718390001001",
        googleCourseId: courseIds[0],
        title: "Chapter 5: Exponents Practice",
        description:
          "Complete problems 1-30 (odd) on page 214. Show all work. Remember to apply the power rule and product rule for exponents. Due by end of day Friday.",
        dueDate: new Date(now + 2 * ONE_DAY).toISOString(),
        alternateLink: `https://classroom.google.com/c/${courseIds[0]}/a/718390001001/details`,
        courseWorkType: "ASSIGNMENT",
        updatedAt: now - 3 * ONE_HOUR,
      },
      {
        googleCourseworkId: "718390001002",
        googleCourseId: courseIds[0],
        title: "Unit 5 Quiz: Exponents & Polynomials",
        description:
          "Online quiz covering sections 5.1 through 5.4. You have one attempt and 45 minutes. Calculators are NOT allowed.",
        dueDate: new Date(now + 5 * ONE_DAY).toISOString(),
        alternateLink: `https://classroom.google.com/c/${courseIds[0]}/a/718390001002/details`,
        courseWorkType: "SHORT_ANSWER_QUESTION",
        updatedAt: now - 1 * ONE_DAY,
      },
      // English Language Arts 8
      {
        googleCourseworkId: "718390002001",
        googleCourseId: courseIds[1],
        title: "Romeo & Juliet Essay Draft 1",
        description:
          'Write a 3-paragraph essay analyzing the theme of fate vs. free will in Acts 1-3 of Romeo and Juliet. Use at least two direct quotes from the text. MLA format. Submit as a Google Doc (share with me).',
        dueDate: new Date(now + 1 * ONE_DAY).toISOString(),
        alternateLink: `https://classroom.google.com/c/${courseIds[1]}/a/718390002001/details`,
        courseWorkType: "ASSIGNMENT",
        updatedAt: now - 2 * ONE_HOUR,
      },
      {
        googleCourseworkId: "718390002002",
        googleCourseId: courseIds[1],
        title: "Vocabulary Week 12: Context Clues Worksheet",
        description:
          "Read each sentence and use context clues to determine the meaning of the underlined word. Write the definition and identify the type of clue used.",
        dueDate: new Date(now - 1 * ONE_DAY).toISOString(), // OVERDUE
        alternateLink: `https://classroom.google.com/c/${courseIds[1]}/a/718390002002/details`,
        courseWorkType: "ASSIGNMENT",
        updatedAt: now - 2 * ONE_DAY,
      },
      // US History
      {
        googleCourseworkId: "718390003001",
        googleCourseId: courseIds[2],
        title: "Civil War Timeline Project",
        description:
          "Create a digital or physical timeline of at least 15 key events from the Civil War era (1860-1865). Include a brief description (2-3 sentences) for each event and at least one primary source image. You may use Google Slides, Canva, or poster board.",
        dueDate: new Date(now + 7 * ONE_DAY).toISOString(),
        alternateLink: `https://classroom.google.com/c/${courseIds[2]}/a/718390003001/details`,
        courseWorkType: "ASSIGNMENT",
        updatedAt: now - 5 * ONE_HOUR,
      },
      {
        googleCourseworkId: "718390003002",
        googleCourseId: courseIds[2],
        title: "Reading Check: Chapter 14 - Reconstruction",
        description:
          "Answer the 10 multiple-choice questions about Chapter 14. You may use your textbook and notes.",
        dueDate: new Date(now + 3 * ONE_DAY).toISOString(),
        alternateLink: `https://classroom.google.com/c/${courseIds[2]}/a/718390003002/details`,
        courseWorkType: "MULTIPLE_CHOICE_QUESTION",
        updatedAt: now - 8 * ONE_HOUR,
      },
      // Science 8 - Biology
      {
        googleCourseworkId: "718390004001",
        googleCourseId: courseIds[3],
        title: "Lab Report: Microscope Observation of Plant Cells",
        description:
          "Write up your lab report from Tuesday's microscope lab. Include: Title, Hypothesis, Materials, Procedure, Observations (with labeled drawings), Data Table, and Conclusion. Follow the lab report template posted in Classroom.",
        dueDate: new Date(now + 4 * ONE_DAY).toISOString(),
        alternateLink: `https://classroom.google.com/c/${courseIds[3]}/a/718390004001/details`,
        courseWorkType: "ASSIGNMENT",
        updatedAt: now - 6 * ONE_HOUR,
      },
      {
        googleCourseworkId: "718390004002",
        googleCourseId: courseIds[3],
        title: "Photosynthesis vs. Cellular Respiration Venn Diagram",
        description:
          "Create a Venn diagram comparing and contrasting photosynthesis and cellular respiration. Include at least 5 items in each section (unique to photosynthesis, unique to cellular respiration, and shared). Use color coding.",
        dueDate: new Date(now - 2 * ONE_DAY).toISOString(), // OVERDUE
        alternateLink: `https://classroom.google.com/c/${courseIds[3]}/a/718390004002/details`,
        courseWorkType: "ASSIGNMENT",
        updatedAt: now - 3 * ONE_DAY,
      },
    ];

    for (const cw of courseworkData) {
      await ctx.db.insert("coursework", {
        ...cw,
        userId,
      });
    }

    // ==============================
    // 4. Create submissions (mix of states)
    // ==============================
    const submissionData = [
      // Algebra - Chapter 5: not yet turned in
      {
        googleSubmissionId: "829500001001",
        googleCourseworkId: "718390001001",
        state: "NEW",
        assignedGrade: undefined,
        alternateLink: `https://classroom.google.com/c/${courseIds[0]}/a/718390001001/submissions/by-status/and-target/829500001001`,
        updatedAt: now - 3 * ONE_HOUR,
      },
      // Algebra - Unit 5 Quiz: not started
      {
        googleSubmissionId: "829500001002",
        googleCourseworkId: "718390001002",
        state: "NEW",
        assignedGrade: undefined,
        alternateLink: `https://classroom.google.com/c/${courseIds[0]}/a/718390001002/submissions/by-status/and-target/829500001002`,
        updatedAt: now - 1 * ONE_DAY,
      },
      // ELA - Romeo & Juliet: turned in, awaiting grade
      {
        googleSubmissionId: "829500002001",
        googleCourseworkId: "718390002001",
        state: "TURNED_IN",
        assignedGrade: undefined,
        alternateLink: `https://classroom.google.com/c/${courseIds[1]}/a/718390002001/submissions/by-status/and-target/829500002001`,
        updatedAt: now - 1 * ONE_HOUR,
      },
      // ELA - Vocabulary: returned with grade
      {
        googleSubmissionId: "829500002002",
        googleCourseworkId: "718390002002",
        state: "RETURNED",
        assignedGrade: 85,
        alternateLink: `https://classroom.google.com/c/${courseIds[1]}/a/718390002002/submissions/by-status/and-target/829500002002`,
        updatedAt: now - 4 * ONE_HOUR,
      },
      // US History - Civil War: created/new
      {
        googleSubmissionId: "829500003001",
        googleCourseworkId: "718390003001",
        state: "CREATED",
        assignedGrade: undefined,
        alternateLink: `https://classroom.google.com/c/${courseIds[2]}/a/718390003001/submissions/by-status/and-target/829500003001`,
        updatedAt: now - 5 * ONE_HOUR,
      },
      // US History - Reading Check: turned in
      {
        googleSubmissionId: "829500003002",
        googleCourseworkId: "718390003002",
        state: "TURNED_IN",
        assignedGrade: undefined,
        alternateLink: `https://classroom.google.com/c/${courseIds[2]}/a/718390003002/submissions/by-status/and-target/829500003002`,
        updatedAt: now - 7 * ONE_HOUR,
      },
      // Science - Lab Report: new
      {
        googleSubmissionId: "829500004001",
        googleCourseworkId: "718390004001",
        state: "NEW",
        assignedGrade: undefined,
        alternateLink: `https://classroom.google.com/c/${courseIds[3]}/a/718390004001/submissions/by-status/and-target/829500004001`,
        updatedAt: now - 6 * ONE_HOUR,
      },
      // Science - Venn Diagram: returned with grade
      {
        googleSubmissionId: "829500004002",
        googleCourseworkId: "718390004002",
        state: "RETURNED",
        assignedGrade: 92,
        alternateLink: `https://classroom.google.com/c/${courseIds[3]}/a/718390004002/submissions/by-status/and-target/829500004002`,
        updatedAt: now - 2 * ONE_DAY,
      },
    ];

    for (const sub of submissionData) {
      await ctx.db.insert("submissions", {
        ...sub,
        userId,
      });
    }

    // ==============================
    // 5. Create private comments from teachers
    // ==============================
    const commentData = [
      {
        googleCommentId: "930600001001",
        googleSubmissionId: "829500001001",
        author: "Mrs. Patterson",
        text: "Alex, don't forget to show your work for the exponent problems. Just writing the answer won't get full credit. Let me know if you need help with the power rule!",
        createdAt: now - 2 * ONE_HOUR,
      },
      {
        googleCommentId: "930600002001",
        googleSubmissionId: "829500002001",
        author: "Mr. Rivera",
        text: "Good start on your essay, Alex! Your thesis statement is strong. For your second paragraph, try to connect the Friar's speech in Act 2 Scene 3 to your argument about fate. Also, check your MLA header formatting.",
        createdAt: now - 45 * 60 * 1000, // 45 minutes ago
      },
      {
        googleCommentId: "930600002002",
        googleSubmissionId: "829500002002",
        author: "Mr. Rivera",
        text: "Nice job on the vocabulary worksheet! You missed #7 (\"benevolent\") - review the sentence again and look at the root word \"bene-\". Your score has been updated.",
        createdAt: now - 3 * ONE_HOUR,
      },
      {
        googleCommentId: "930600003001",
        googleSubmissionId: "829500003001",
        author: "Ms. Chen",
        text: "Alex, I noticed you haven't started the timeline yet. Remember this is a major project grade. Come see me during office hours if you need help finding primary sources. The Library of Congress website is a great place to start!",
        createdAt: now - 4 * ONE_HOUR,
      },
      {
        googleCommentId: "930600004001",
        googleSubmissionId: "829500004002",
        author: "Dr. Williams",
        text: "Excellent Venn diagram, Alex! Your comparison of the energy inputs and outputs was very thorough. One small note: chloroplasts are the organelle for photosynthesis, not chlorophyll (chlorophyll is the pigment inside chloroplasts). 92/100.",
        createdAt: now - 1 * ONE_DAY,
      },
    ];

    for (const comment of commentData) {
      await ctx.db.insert("privateComments", {
        ...comment,
        userId,
      });
    }

    // ==============================
    // 6. Mark some items as seen
    // ==============================
    const seenItems = [
      // The vocabulary worksheet (overdue, already returned) is seen
      {
        itemType: "assignment",
        itemGoogleId: "718390002002",
        seenAt: now - 1 * ONE_HOUR,
      },
      // The returned Venn diagram is seen
      {
        itemType: "returned_work",
        itemGoogleId: "829500004002",
        seenAt: now - 12 * ONE_HOUR,
      },
      // One of the older comments is seen
      {
        itemType: "private_comment",
        itemGoogleId: "930600002002",
        seenAt: now - 2 * ONE_HOUR,
      },
    ];

    for (const seen of seenItems) {
      await ctx.db.insert("seenStates", {
        ...seen,
        userId,
      });
    }

    // ==============================
    // 7. Create sync state
    // ==============================
    await ctx.db.insert("syncStates", {
      userId,
      lastSyncAt: now,
    });

    return { status: "seeded", userId };
  },
});
