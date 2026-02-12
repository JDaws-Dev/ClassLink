// =============================================================================
// ClassLinker - Mock Data Module
// =============================================================================
// Comprehensive mock data for development and testing.
// This module provides typed mock data that mirrors the shape of real
// Google Classroom API responses, allowing full UI development without
// needing live API credentials.
// =============================================================================

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export type InboxItemType = "assignment" | "private_comment" | "returned_work";

export interface InboxItem {
  id: string;
  type: InboxItemType;
  courseId: string;
  courseName: string;
  title: string;
  subtitle: string;
  description: string;
  timestamp: string;
  dueDate?: string;
  isSeen: boolean;
  alternateLink: string;
  googleItemId: string;
}

export interface Course {
  id: string;
  name: string;
  color: string;
  teacherName: string;
  section: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface CommentThread {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  isTeacher: boolean;
}

// ---------------------------------------------------------------------------
// Mock User Profile
// ---------------------------------------------------------------------------

export const MOCK_USER: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@student.edu",
  avatarUrl: "https://ui-avatars.com/api/?name=Alex+Johnson&background=7C3AED&color=fff&size=128",
};

// ---------------------------------------------------------------------------
// Mock Courses
// ---------------------------------------------------------------------------

export const MOCK_COURSES: Course[] = [
  {
    id: "course-algebra-1",
    name: "Algebra 1",
    color: "#7C3AED",
    teacherName: "Mr. Thompson",
    section: "Period 3",
  },
  {
    id: "course-ela-8",
    name: "English Language Arts 8",
    color: "#2563EB",
    teacherName: "Ms. Rivera",
    section: "Period 1",
  },
  {
    id: "course-us-history",
    name: "US History",
    color: "#10B981",
    teacherName: "Mr. Nakamura",
    section: "Period 5",
  },
  {
    id: "course-science-8",
    name: "Science 8 - Biology",
    color: "#F59E0B",
    teacherName: "Dr. Patel",
    section: "Period 7",
  },
];

// ---------------------------------------------------------------------------
// Mock Inbox Items
// ---------------------------------------------------------------------------

export const MOCK_INBOX_ITEMS: InboxItem[] = [
  // ---- Assignments (4) ----
  {
    id: "inbox-001",
    type: "assignment",
    courseId: "course-algebra-1",
    courseName: "Algebra 1",
    title: "Chapter 5: Exponents Practice",
    subtitle: "Due tomorrow at 11:59 PM",
    description:
      "Complete problems 1-30 (odds only) from page 247. Show all work for full credit. Remember to use the exponent rules we discussed in class today.",
    timestamp: "2 hours ago",
    dueDate: "Tomorrow at 11:59 PM",
    isSeen: false,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMDk/a/NjM1MjE4NzQ/details",
    googleItemId: "gci-635218740",
  },
  {
    id: "inbox-002",
    type: "assignment",
    courseId: "course-ela-8",
    courseName: "English Language Arts 8",
    title: "Romeo & Juliet Essay Draft 1",
    subtitle: "Due Friday at 11:59 PM",
    description:
      "Write a 3-paragraph essay analyzing the theme of fate vs. free will in Act 1 of Romeo & Juliet. Use at least two direct quotes from the text to support your argument. MLA format, double spaced.",
    timestamp: "Yesterday",
    dueDate: "Friday at 11:59 PM",
    isSeen: true,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTI/a/NjM1MjE5MDI/details",
    googleItemId: "gci-635219020",
  },
  {
    id: "inbox-003",
    type: "assignment",
    courseId: "course-us-history",
    courseName: "US History",
    title: "Civil War Timeline Project",
    subtitle: "OVERDUE - Was due Monday at 3:00 PM",
    description:
      "Create an illustrated timeline of 10 major events from the Civil War (1861-1865). Each event should include the date, a brief description (2-3 sentences), and its significance. You may use Google Slides, Canva, or hand-draw and photograph your timeline.",
    timestamp: "3 days ago",
    dueDate: "Monday at 3:00 PM",
    isSeen: true,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTU/a/NjM1MjE5MzA/details",
    googleItemId: "gci-635219300",
  },
  {
    id: "inbox-004",
    type: "assignment",
    courseId: "course-science-8",
    courseName: "Science 8 - Biology",
    title: "Lab Report: Photosynthesis",
    subtitle: "Due next Wednesday at 11:59 PM",
    description:
      "Write a formal lab report for the photosynthesis experiment we conducted in class. Include all sections: Title, Hypothesis, Materials, Procedure, Data/Observations, Analysis, and Conclusion. Use the lab report template shared in Google Classroom.",
    timestamp: "5 hours ago",
    dueDate: "Next Wednesday at 11:59 PM",
    isSeen: false,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTg/a/NjM1MjE5NTg/details",
    googleItemId: "gci-635219580",
  },

  // ---- Private Comments (3) ----
  {
    id: "inbox-005",
    type: "private_comment",
    courseId: "course-ela-8",
    courseName: "English Language Arts 8",
    title: "Comment on: Romeo & Juliet Reading Questions",
    subtitle: "Ms. Rivera: Great start, but check your thesis statement",
    description:
      'Ms. Rivera left a private comment on your submission for "Romeo & Juliet Reading Questions - Act 1, Scenes 1-3". She has some feedback on strengthening your analysis.',
    timestamp: "4 hours ago",
    isSeen: false,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTI/a/NjM1MjE4NjA/submissions/by-status/and-target/NjE0NTIzMTI",
    googleItemId: "gci-635218600",
  },
  {
    id: "inbox-006",
    type: "private_comment",
    courseId: "course-algebra-1",
    courseName: "Algebra 1",
    title: "Comment on: Chapter 4 Homework",
    subtitle: "Mr. Thompson: See my note about problem #14",
    description:
      'Mr. Thompson left a private comment on your "Chapter 4: Polynomials Homework" submission. He noticed an error in your work on problem #14 and wants you to review it.',
    timestamp: "Yesterday",
    isSeen: true,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMDk/a/NjM1MjE4NTI/submissions/by-status/and-target/NjE0NTIzMDk",
    googleItemId: "gci-635218520",
  },
  {
    id: "inbox-007",
    type: "private_comment",
    courseId: "course-science-8",
    courseName: "Science 8 - Biology",
    title: "Comment on: Cell Division Worksheet",
    subtitle: "Dr. Patel: Excellent diagram! One small correction needed.",
    description:
      'Dr. Patel commented on your "Cell Division Worksheet" submission. She was impressed with your mitosis diagram but noticed the labels for anaphase and metaphase may be swapped.',
    timestamp: "2 days ago",
    isSeen: true,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTg/a/NjM1MjE4NDQ/submissions/by-status/and-target/NjE0NTIzMTg",
    googleItemId: "gci-635218440",
  },

  // ---- Returned Work (3) ----
  {
    id: "inbox-008",
    type: "returned_work",
    courseId: "course-us-history",
    courseName: "US History",
    title: "Returned: Weekly Vocabulary Quiz 12",
    subtitle: "Grade: 87/100 - Nice work!",
    description:
      "Your Weekly Vocabulary Quiz 12 on Civil War terminology has been graded and returned. You scored 87/100. Review the corrections on questions 4, 9, and 13.",
    timestamp: "Yesterday",
    isSeen: false,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTU/a/NjM1MjE4MzY/submissions/by-status/and-target/NjE0NTIzMTU",
    googleItemId: "gci-635218360",
  },
  {
    id: "inbox-009",
    type: "returned_work",
    courseId: "course-ela-8",
    courseName: "English Language Arts 8",
    title: "Returned: Persuasive Essay - School Uniforms",
    subtitle: "Grade: 92/100 - Strong argument!",
    description:
      'Your persuasive essay on school uniforms has been graded. You received 92/100. Ms. Rivera noted: "Excellent use of rhetorical devices. Work on transition sentences between paragraphs."',
    timestamp: "3 days ago",
    isSeen: true,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTI/a/NjM1MjE4Mjg/submissions/by-status/and-target/NjE0NTIzMTI",
    googleItemId: "gci-635218280",
  },
  {
    id: "inbox-010",
    type: "returned_work",
    courseId: "course-science-8",
    courseName: "Science 8 - Biology",
    title: "Returned: Ecosystem Diorama Project",
    subtitle: "Grade: 78/100 - See comments for improvement areas",
    description:
      "Your Ecosystem Diorama Project has been graded and returned. You scored 78/100. Dr. Patel left detailed feedback about adding more producer organisms and labeling the energy flow arrows.",
    timestamp: "5 days ago",
    isSeen: true,
    alternateLink:
      "https://classroom.google.com/c/NjE0NTIzMTg/a/NjM1MjE4MjA/submissions/by-status/and-target/NjE0NTIzMTg",
    googleItemId: "gci-635218200",
  },
];

// ---------------------------------------------------------------------------
// Mock Comment Threads (keyed by inbox item ID)
// ---------------------------------------------------------------------------

export const MOCK_COMMENT_THREADS: Record<string, CommentThread[]> = {
  // Thread for "Comment on: Romeo & Juliet Reading Questions"
  "inbox-005": [
    {
      id: "cmt-005-1",
      author: "Alex Johnson",
      text: "Hi Ms. Rivera, I submitted my reading questions for Act 1. I wasn't sure about question 3 — is the Prince's speech foreshadowing or just a warning?",
      createdAt: "2 days ago",
      isTeacher: false,
    },
    {
      id: "cmt-005-2",
      author: "Ms. Rivera",
      text: "Great question, Alex! Think about what happens later in the play. Does the Prince's warning come true in a specific way? That distinction will help you decide if it's foreshadowing. Also, your thesis statement in question 5 could be stronger — try to be more specific about *which* conflict drives the scene. You're on the right track!",
      createdAt: "4 hours ago",
      isTeacher: true,
    },
  ],

  // Thread for "Comment on: Chapter 4 Homework"
  "inbox-006": [
    {
      id: "cmt-006-1",
      author: "Alex Johnson",
      text: "Mr. Thompson, I tried problem #14 three times but keep getting a negative answer. Is that possible for this type of problem?",
      createdAt: "2 days ago",
      isTeacher: false,
    },
    {
      id: "cmt-006-2",
      author: "Mr. Thompson",
      text: "Good effort on retrying! A negative answer is actually valid here since we're working with subtraction of polynomials. However, check your sign on the second term — I think you may have distributed the negative incorrectly in step 2. Look at the example on page 203 for reference.",
      createdAt: "Yesterday",
      isTeacher: true,
    },
    {
      id: "cmt-006-3",
      author: "Alex Johnson",
      text: "Oh I see it now! I forgot to flip the sign on the 3x term when distributing. Thanks!",
      createdAt: "Yesterday",
      isTeacher: false,
    },
  ],

  // Thread for "Comment on: Cell Division Worksheet"
  "inbox-007": [
    {
      id: "cmt-007-1",
      author: "Dr. Patel",
      text: "Alex, your mitosis diagram is really well-drawn! I can tell you put a lot of effort into it. One thing to fix: double-check the order of metaphase and anaphase. Remember the mnemonic we learned in class — PMAT. Which phase comes first?",
      createdAt: "2 days ago",
      isTeacher: true,
    },
    {
      id: "cmt-007-2",
      author: "Alex Johnson",
      text: "Oh no, I think I swapped them! Metaphase is when chromosomes line up in the middle and anaphase is when they pull apart, right? I'll fix the labels.",
      createdAt: "2 days ago",
      isTeacher: false,
    },
    {
      id: "cmt-007-3",
      author: "Dr. Patel",
      text: "Exactly right! 'Meta' = middle, 'Ana' = apart. Fix the labels and resubmit whenever you're ready. No rush.",
      createdAt: "2 days ago",
      isTeacher: true,
    },
  ],

  // Thread for "Returned: Weekly Vocabulary Quiz 12"
  "inbox-008": [
    {
      id: "cmt-008-1",
      author: "Mr. Nakamura",
      text: "Nice work on the vocab quiz, Alex! You clearly studied the terms. For the three you missed, review the difference between 'secession' and 'succession' — that tripped up a few students. Also revisit 'abolitionist' vs 'emancipation'. Keep it up!",
      createdAt: "Yesterday",
      isTeacher: true,
    },
  ],

  // Thread for "Returned: Ecosystem Diorama Project"
  "inbox-010": [
    {
      id: "cmt-010-1",
      author: "Dr. Patel",
      text: "Alex, your diorama looked creative and the predator-prey relationships were well represented. To improve your grade, I'd suggest: (1) Add at least 2 more producer organisms (plants/algae), (2) Label the energy flow arrows to show which direction energy moves in the food chain, and (3) Include a decomposer in your ecosystem. You can resubmit for up to 90/100 by next Friday.",
      createdAt: "5 days ago",
      isTeacher: true,
    },
    {
      id: "cmt-010-2",
      author: "Alex Johnson",
      text: "Thank you Dr. Patel! I'll add more plants and a mushroom for the decomposer. Should the energy arrows point from prey to predator or the other way?",
      createdAt: "4 days ago",
      isTeacher: false,
    },
    {
      id: "cmt-010-3",
      author: "Dr. Patel",
      text: "Great question! Energy flows from what is eaten TO what eats it. So arrows go from plants -> herbivore -> predator. Think of it as 'the energy goes where the food goes.' Looking forward to your resubmission!",
      createdAt: "4 days ago",
      isTeacher: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mock Assignment Details (keyed by inbox item ID)
// Detailed descriptions for assignment items, used in the detail/tutor view.
// ---------------------------------------------------------------------------

export const MOCK_ASSIGNMENT_DETAILS: Record<string, string> = {
  "inbox-001": `**Chapter 5: Exponents Practice**

Complete problems 1-30 (odd numbers only) from page 247 of your textbook. This assignment covers the following exponent rules that we discussed in class:

- Product Rule: a^m * a^n = a^(m+n)
- Quotient Rule: a^m / a^n = a^(m-n)
- Power Rule: (a^m)^n = a^(m*n)
- Zero Exponent Rule: a^0 = 1 (where a ≠ 0)
- Negative Exponent Rule: a^(-n) = 1/a^n

**Requirements:**
You must show ALL work for each problem to receive full credit. This means writing out each step of simplification, not just the final answer. If you use the product rule, label which rule you used. Problems 25-30 combine multiple rules, so be extra careful with those.

**Tips:**
Start with the easier problems (1-15) to build confidence, then tackle the multi-step problems. If you get stuck, refer to the worked examples on pages 243-246 or watch the Khan Academy video I linked in the class stream. Remember: when in doubt, expand the exponents out and count!`,

  "inbox-002": `**Romeo & Juliet Essay Draft 1 — Fate vs. Free Will in Act 1**

Write a 3-paragraph essay analyzing the theme of fate versus free will in Act 1 of Shakespeare's Romeo & Juliet. This is your FIRST DRAFT — focus on getting your ideas down. We will workshop and revise in class next week.

**Essay Structure:**
- Paragraph 1 (Introduction): Introduce the play and state your thesis. Do the characters in Act 1 seem controlled by fate, or are they making free choices? Take a clear position.
- Paragraph 2 (Body): Provide evidence from Act 1 to support your thesis. You must include at least TWO direct quotes from the text. For each quote, explain how it supports your argument. Use the "Quote Sandwich" method we practiced: introduce the quote, include the quote, then explain its significance.
- Paragraph 3 (Conclusion): Summarize your argument and explain why this theme matters. How does the tension between fate and free will create drama in the story?

**Formatting Requirements:**
- MLA format (Times New Roman 12pt, double spaced, 1-inch margins)
- Include a proper MLA header (your name, my name, class, date)
- Cite quotes using act, scene, and line numbers: (1.2.45-47)
- Minimum 400 words, maximum 600 words

**Grading Rubric:**
- Thesis clarity and strength: 25 points
- Use of textual evidence: 25 points
- Analysis and explanation: 25 points
- Writing mechanics and MLA format: 25 points`,

  "inbox-003": `**Civil War Timeline Project**

Create an illustrated timeline of 10 major events from the American Civil War (1861-1865). This project allows you to visualize the progression of the war and understand how key events connected to each other.

**Required Events (choose at least 5 from this list, plus 5 of your own choosing):**
- Fort Sumter (April 1861)
- First Battle of Bull Run (July 1861)
- Emancipation Proclamation (January 1863)
- Battle of Gettysburg (July 1863)
- Gettysburg Address (November 1863)
- Sherman's March to the Sea (Nov-Dec 1864)
- Surrender at Appomattox (April 1865)
- Assassination of Lincoln (April 1865)

**For each event, include:**
1. The exact or approximate date
2. A brief description (2-3 sentences) explaining what happened
3. A sentence explaining the significance — why did this event matter?
4. An illustration, image, or symbol representing the event

**Format Options:**
You may create your timeline using Google Slides (use the template I shared), Canva, hand-draw and photograph it, or use any other visual tool. The timeline should be clearly readable and flow chronologically from left to right or top to bottom.

**Grading:**
- Accuracy of dates and descriptions: 30 points
- Quality of significance explanations: 30 points
- Visual presentation and creativity: 20 points
- Completeness (all 10 events): 20 points`,

  "inbox-004": `**Lab Report: Photosynthesis Experiment**

Write a formal lab report for the photosynthesis experiment we conducted in class on Tuesday. Use the Lab Report Template shared in Google Classroom (File > Make a Copy).

**Experiment Recap:**
We tested how different light colors (red, blue, green, white) affect the rate of photosynthesis in Elodea (aquatic plant) by counting oxygen bubbles produced over 10-minute intervals.

**Required Sections:**

1. **Title Page:** Include the experiment title, your name, lab partner's name, date, and class period.

2. **Hypothesis:** State your prediction about which light color would produce the most photosynthesis and WHY. Use "If... then... because..." format.

3. **Materials:** List all materials used in the experiment (Elodea sprigs, beakers, colored cellophane, lamp, timer, etc.)

4. **Procedure:** Write numbered steps describing exactly what we did. Someone should be able to repeat the experiment from your instructions. Include the control setup.

5. **Data/Observations:** Include your data table showing bubble counts for each color at each time interval. Create a bar graph comparing the average bubble counts across all four colors. Note any observations you made during the experiment.

6. **Analysis:** Answer these guiding questions in paragraph form:
   - Which light color produced the most oxygen bubbles? The least?
   - How do your results relate to what you know about the light absorption spectrum of chlorophyll?
   - Why was the white light included as a control?
   - Were there any sources of error in the experiment?

7. **Conclusion:** Summarize your findings in 3-5 sentences. Was your hypothesis supported? What did you learn about photosynthesis and light?`,
};
