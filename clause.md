You are a senior full-stack engineer. Help me build a web app called "ClassLinker" that fixes a specific Google Classroom pain: when a student gets an email/notification about a PRIVATE COMMENT or assignment update, clicking "Go to Google Classroom" doesn't deep-link to the exact item, so the student has to hunt and can miss it.

Goal: A simple dashboard that shows "everything that needs my attention" with one-click deep links to the exact Classroom item (private comment thread, assignment, question, announcement). Secondary goal: an AI "tutor / explainer" that helps a 13-year-old understand assignments and concepts (like exponents) WITHOUT giving direct answers.

Build this as an MVP first. Keep it simple, safe, and student-friendly.

========================
1) MVP FEATURE SET
========================
A. Auth
- Google OAuth login (student logs in with their Google account).
- Request minimal scopes needed to read Classroom courses, coursework, and private comments/announcements.
- Store refresh tokens securely (server-side only).

B. Dashboard
- Show a list called "Inbox" of actionable items:
  1) New/updated private comments on coursework (teacher ↔ student).
  2) New/updated coursework assigned to the student (including due date).
  3) Returned/graded work updates if available.
- Each item shows: course name, assignment title, item type (private comment / assignment / returned), timestamp, and a "Go" button.
- "Go" button deep-links as close as possible to the exact item in Classroom (or opens our own "detail view" with the relevant info if Google doesn't provide perfect deep links).
- Filters: by course, by "unread/new", due soon, overdue.
- "Mark as seen" locally (does NOT change Classroom; just in our app).

C. Item Detail View
- Show the assignment instructions and the private comment thread (if the API allows).
- Provide a "Copy link" button and "Open in Classroom" button.
- Provide an "Explain this to me" panel (AI).

D. AI Explainer / Tutor (Non-cheating)
- The AI must:
  - Summarize the assignment in kid-friendly language.
  - Identify what the student is being asked to do (deliverable + steps).
  - Provide guided hints and Socratic questions.
  - Provide mini-lessons on concepts (e.g., exponents) with examples NOT identical to the student's exact problem.
  - Refuse to give final answers, full solutions, or write the student's submission.
  - If the student pastes a question/problem, AI should explain how to solve it step-by-step but stop short of the final numeric answer (or provide multiple choice reasoning without revealing which option is correct).
- Include a "Help level" slider: (1) Explain / (2) Hint / (3) Walk-through (still no final answer).
- Add a "Cite source" behavior: for math explanations, rely on general knowledge; don't fabricate quotes.

E. Simple Monetization-ready (optional, but design for it)
- Architect so we can later add Stripe subscription ($1/month) with feature gating.
- For MVP, you can stub this behind a feature flag.

========================
2) TECH STACK (choose one and justify)
========================
Prefer: Next.js (App Router) + TypeScript.
- Frontend: React components in Next.js.
- Backend: Next.js API routes (or server actions) OR a small Node/Express service.
- DB: Postgres (Supabase) OR SQLite (for local dev) + Prisma ORM.
- Auth: Google OAuth via NextAuth or custom OAuth (be explicit).
- Deployment target: Vercel (assume).
- Use environment variables for secrets.

========================
3) GOOGLE CLASSROOM API NOTES
========================
- Implement Google Classroom API integration:
  - List courses where user is a student.
  - List coursework for each course.
  - Fetch student submissions for the logged-in student when needed.
  - Fetch private comments for a submission if available.
- If perfect "notification feed" isn't available directly, implement polling:
  - On login, sync recent items (last 14 days).
  - Store last-seen timestamps per course/coursework/submission.
  - Compute "new since last sync" in our DB.
- IMPORTANT: Many Classroom resources are teacher-privileged. Design around the permissions the student account realistically has.

========================
4) DATA MODEL
========================
Propose a minimal schema, e.g.:
- User { id, googleSub, email, name, avatarUrl, createdAt }
- Token { userId, accessTokenEncrypted, refreshTokenEncrypted, expiresAt }
- Course { id, googleCourseId, name, section, ... }
- Coursework { id, googleCourseworkId, googleCourseId, title, dueDate, updatedAt, ... }
- Submission { id, googleSubmissionId, googleCourseworkId, state, assignedGrade, updatedAt, ... }
- PrivateComment { id, googleCommentId, googleSubmissionId, author, createdAt, contentHash, ... }
- SeenState { userId, itemType, itemGoogleId, seenAt }
- SyncState { userId, lastSyncAt, perCourseLastSyncJson }

Keep the schema small and evolve later.

========================
5) UX / UI
========================
Keep it "13-year-old friendly" and fast:
- Left sidebar: Courses.
- Main: Inbox list.
- Right panel or detail page: Item details + AI.
- Use simple language: "New teacher comment", "Due soon", "Overdue".
- Avoid "magical" branding. ClassLinker is practical.

========================
6) SECURITY / PRIVACY
========================
- Do NOT store full assignment text permanently unless needed; prefer caching short-term.
- Encrypt tokens at rest.
- Don't log private comment text in server logs.
- Rate-limit AI endpoint.
- Basic abuse protections (input length limits).
- Include a clear disclaimer: "This helps you understand, not cheat."

========================
7) BUILD PLAN (deliverables)
========================
I want you (Claude) to produce, in order:
1) A high-level architecture diagram in text (components + data flow).
2) Concrete API endpoints (routes) and what they return.
3) DB schema (Prisma or SQL).
4) OAuth setup steps + required scopes.
5) Classroom sync algorithm (polling + diffing).
6) AI tutor prompt template + guardrails logic (server-side).
7) Minimal UI routes/components list.
8) Then generate the actual code scaffold for the Next.js project with:
   - env.example
   - README setup instructions
   - working login
   - sample "Inbox" page (even with mocked data first)
   - one real sync call to Classroom API

Ask me any ONE critical question only if you truly cannot proceed. Otherwise, make reasonable assumptions and document them.

========================
8) ASSUMPTIONS
========================
- User is a student account.
- We'll start with read-only access; no posting comments.
- We accept that deep links may not always point to the exact private comment; fallback is our detail view.

Now begin with (1) architecture diagram + stack choice.
