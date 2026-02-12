// =============================================================================
// ClassLinker - AI Tutor Module
// =============================================================================
// Provides Socratic tutoring assistance for students using AI.
// Currently returns mock responses for development; will integrate with
// OpenAI's API when OPENAI_API_KEY is configured.
//
// Required environment variable:
//   OPENAI_API_KEY - API key from platform.openai.com
//
// Design principles:
//   - Age-appropriate: language suitable for 13-year-old students
//   - Socratic method: guide students to discover answers, never give them
//   - Safety guardrails: refuse to write submissions or give final answers
//   - Adaptive: adjusts depth based on the selected help level
// =============================================================================

// ---------------------------------------------------------------------------
// System Prompt
// ---------------------------------------------------------------------------

/**
 * System prompt template for the AI tutor.
 * This prompt establishes the tutor's personality, guardrails, and behavior.
 * The {helpLevel} placeholder is replaced at runtime.
 */
export const AI_TUTOR_SYSTEM_PROMPT = `You are a friendly, encouraging tutor helping a 13-year-old middle school student with their schoolwork. Your name is ClassLinker Tutor.

CORE RULES — you must ALWAYS follow these:
1. NEVER give the student the final answer to any assignment, quiz, or homework problem.
2. NEVER write essays, reports, or any submission content for the student.
3. NEVER complete math problems fully — show the approach, not the solution.
4. If the student asks you to "just give me the answer" or "write this for me," politely decline and redirect them to think through the problem.
5. Keep your language simple, clear, and age-appropriate. Avoid jargon unless you define it.
6. Be encouraging and positive. Celebrate effort and good thinking.
7. If the student seems frustrated, acknowledge their feelings and suggest taking a different approach.

YOUR ROLE BASED ON HELP LEVEL:

When help level is "explain":
- Summarize the assignment in simple, kid-friendly language
- Break down what the assignment is asking the student to do
- Explain any confusing vocabulary or concepts
- Give a clear overview of the steps needed to complete the work
- Think of this as "What does this assignment actually want me to do?"

When help level is "hint":
- Give a small, specific hint that nudges the student in the right direction
- Ask a guiding question that helps them think about the next step
- Reference relevant concepts without solving the problem
- Use analogies or real-world examples to make abstract concepts concrete
- Think of this as "I'm stuck — give me a nudge"

When help level is "walkthrough":
- Walk through the problem-solving process step by step
- At each step, explain WHAT to do and WHY, but let the student do the actual work
- Pause to ask "Does this make sense so far?" style questions
- Provide a structured framework or outline they can follow
- Think of this as "Walk me through how to approach this"

FORMATTING:
- Use short paragraphs (2-3 sentences max)
- Use bullet points or numbered lists when breaking down steps
- Bold important terms or key ideas using **bold**
- Use emoji sparingly (one or two per response max) to keep things friendly

SAFETY:
- If the student asks about anything unrelated to schoolwork, gently redirect to the assignment
- If the student shares personal information, do not engage with it — redirect to academics
- If the content seems inappropriate or harmful, respond with: "I'm here to help with schoolwork! Let's get back to your assignment."`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HelpLevel = "explain" | "hint" | "walkthrough";

export interface AITutorParams {
  assignmentTitle: string;
  assignmentDescription: string;
  studentQuestion: string;
  helpLevel: HelpLevel;
  chatHistory: { role: string; content: string }[];
}

// ---------------------------------------------------------------------------
// Mock Responses
// ---------------------------------------------------------------------------

const MOCK_EXPLAIN_RESPONSES: Record<string, string> = {
  default: `Okay, let me break this down for you! 📚

This assignment is asking you to **show that you understand the material** by completing a set of practice problems or writing a response.

Here's what you need to do:
1. **Read the instructions carefully** — look for keywords like "explain," "compare," "solve," or "create"
2. **Gather your materials** — check your textbook, class notes, or any handouts your teacher shared
3. **Work through it step by step** — don't try to do everything at once

The most important thing is to **show your thinking**. Teachers want to see HOW you got to your answer, not just the answer itself.

Does that help clarify what you need to do? Let me know if any part of the instructions is confusing!`,

  math: `Let me explain what this math assignment is about! 🔢

This assignment is practicing a specific math skill. Here's the big picture:

1. **What you're learning**: The problems are designed to help you get comfortable with a math concept your teacher just covered in class
2. **What "show your work" means**: Write out each step of your calculation — don't skip steps, even if you can do them in your head
3. **Why odds only**: Your teacher assigned odd-numbered problems because those usually have answers in the back of the book, so you can check yourself as you go

**Pro tip**: Start with the first few problems (they're usually the easiest) to build your confidence. The harder ones come later and combine multiple skills.

Want me to give you a hint on a specific problem you're stuck on?`,

  essay: `Let me break down this essay assignment for you! ✍️

Here's what your teacher is really asking:

1. **Pick a clear position** — The essay wants you to make an argument. Think of a thesis statement as your "main point" that everything else supports
2. **Find evidence** — You need quotes or examples from the text that back up your argument. Think of these as "proof" for your point
3. **Explain your evidence** — Don't just drop quotes in! Tell the reader WHY each quote matters and HOW it connects to your thesis

**The structure is basically:**
- Introduction: Tell the reader what you're going to argue
- Body: Prove your argument with evidence
- Conclusion: Wrap it up and explain why it matters

The hardest part is usually the thesis statement. Try filling in this sentence: "In [text], the author shows that [your main argument] through [how they show it]."

Would you like help brainstorming your thesis?`,
};

const MOCK_HINT_RESPONSES: Record<string, string> = {
  default: `Here's a nudge to get you going! 💡

Think about it this way: **what is the question really asking?** Sometimes we overcomplicate things.

Try re-reading the instructions and underlining the action words (like "describe," "calculate," "compare"). Those words tell you exactly what to do.

What part specifically has you stuck? I can give you a more targeted hint!`,

  math: `Here's a hint! 💡

Look at the problem again and ask yourself: **which rule or formula from class applies here?**

A good strategy is to:
- Write down what you **know** (the given information)
- Write down what you **need to find** (the answer you're looking for)
- Think about which tool (formula, rule, method) **connects** the two

Sometimes it helps to look at a similar example problem from your textbook first, then follow the same steps with your numbers.

Which specific problem are you working on? I can point you in the right direction!`,

  essay: `Here's a nudge! 💡

If you're stuck on what to write, try **talking it out loud** first. Pretend you're explaining your idea to a friend. What would you say?

Sometimes the hardest part is just getting started. Try this: write the WORST possible version first — just get words on the page. You can fix it later!

What specific part is giving you trouble — the thesis, finding quotes, or connecting your ideas?`,
};

const MOCK_WALKTHROUGH_RESPONSES: Record<string, string> = {
  default: `Let's work through this step by step! I'll guide you, and you do the actual work. 🚶

**Step 1: Understand the assignment**
Read through the instructions ONE more time. As you read, highlight or underline:
- What you need to produce (essay? worksheet? project?)
- How long it should be or how many problems
- When it's due
- Any specific requirements (format, sources, showing work)

Got that? Great!

**Step 2: Gather what you need**
Before you start working, get everything together:
- Your textbook or reading material
- Class notes from the relevant lessons
- Any templates or rubrics your teacher shared

**Step 3: Break it into chunks**
Don't try to do the whole thing at once. Break it into smaller tasks. For example, if it's 30 problems, do 10, take a break, do 10 more, etc.

**Step 4: Start with what you know**
Begin with the easiest part. This builds momentum and confidence.

Ready to dive into Step 1? Tell me what the assignment is asking for in your own words!`,

  math: `Let's walk through the approach together! I'll show you the method, and you apply it. 🚶

**Step 1: Identify what type of problem this is**
Look at the problem and ask: what math concept is this testing? Check your chapter title or section header for a clue.

**Step 2: Write down the relevant rule or formula**
From your notes or textbook, find the rule that applies. Write it at the top of your work space so you can reference it.

**Step 3: Set up the problem**
- Write down what's given
- Write down what you need to find
- Plug the given information into your formula

**Step 4: Solve step by step**
Work through the calculation one step at a time. Write each step on a new line. Don't skip steps!

**Step 5: Check your answer**
- Does the answer make sense? (Is it reasonable?)
- Can you plug your answer back in to verify?
- If it's an odd problem, check the back of the book

Try following these steps with the first problem and tell me where you get stuck. I'm right here to help!`,

  essay: `Let's walk through writing this essay together, step by step! ✍️🚶

**Step 1: Brainstorm (5 minutes)**
Before writing anything, jot down 3-4 ideas related to the essay topic. Don't judge them yet — just get them on paper. Which idea do you feel most strongly about? That's probably your thesis.

**Step 2: Write a working thesis**
Fill in this template: "I believe that [your main argument] because [reason 1] and [reason 2]."
It doesn't have to be perfect — we'll revise it later.

**Step 3: Find your evidence**
Go back to the text and find 2-3 quotes that support your thesis. For each quote, write a quick note about WHY it supports your argument.

**Step 4: Write the body paragraph first**
Start with the body (not the intro!). For each piece of evidence:
- Introduce it: "In the text, the author shows..."
- Include the quote
- Explain it: "This demonstrates that..."

**Step 5: Write the intro and conclusion**
Now that you know what your body says, write an intro that previews it and a conclusion that wraps it up.

**Step 6: Revise**
Read it out loud. Does it flow? Fix any awkward spots.

Let's start with Step 1 — what are your initial ideas about the topic?`,
};

// ---------------------------------------------------------------------------
// Helper: Determine response category from assignment context
// ---------------------------------------------------------------------------

function getResponseCategory(title: string, description: string): string {
  const combined = `${title} ${description}`.toLowerCase();

  if (
    combined.includes("math") ||
    combined.includes("algebra") ||
    combined.includes("equation") ||
    combined.includes("exponent") ||
    combined.includes("polynomial") ||
    combined.includes("problem") ||
    combined.includes("calculate") ||
    combined.includes("chapter") && combined.includes("practice")
  ) {
    return "math";
  }

  if (
    combined.includes("essay") ||
    combined.includes("write") ||
    combined.includes("draft") ||
    combined.includes("paragraph") ||
    combined.includes("thesis") ||
    combined.includes("persuasive") ||
    combined.includes("narrative")
  ) {
    return "essay";
  }

  return "default";
}

// ---------------------------------------------------------------------------
// Main AI Tutor Function
// ---------------------------------------------------------------------------

/**
 * Get an AI tutor response for a student's question about an assignment.
 *
 * TODO: Replace with OpenAI API call using OPENAI_API_KEY
 *
 * Real implementation would:
 *   1. Build messages array with system prompt + chat history + new question
 *   2. Call OpenAI's chat completions API (gpt-4o-mini for cost efficiency)
 *   3. Stream the response back to the client
 *   4. Log usage for rate limiting and analytics
 *
 * Example OpenAI call:
 *   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 *   const completion = await openai.chat.completions.create({
 *     model: "gpt-4o-mini",
 *     messages: [
 *       { role: "system", content: AI_TUTOR_SYSTEM_PROMPT },
 *       ...chatHistory,
 *       { role: "user", content: studentQuestion }
 *     ],
 *     max_tokens: 1000,
 *     temperature: 0.7,
 *   });
 *   return completion.choices[0].message.content;
 *
 * @param params - The tutor request parameters
 * @returns The AI tutor's response text
 */
export async function getAITutorResponse(params: AITutorParams): Promise<string> {
  const { assignmentTitle, assignmentDescription, studentQuestion, helpLevel } = params;

  // TODO: Replace with OpenAI API call using OPENAI_API_KEY
  // For now, return contextually appropriate mock responses

  // Simulate a brief "thinking" delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const category = getResponseCategory(assignmentTitle, assignmentDescription);

  // Select the appropriate response based on help level
  let responseMap: Record<string, string>;

  switch (helpLevel) {
    case "explain":
      responseMap = MOCK_EXPLAIN_RESPONSES;
      break;
    case "hint":
      responseMap = MOCK_HINT_RESPONSES;
      break;
    case "walkthrough":
      responseMap = MOCK_WALKTHROUGH_RESPONSES;
      break;
    default:
      responseMap = MOCK_EXPLAIN_RESPONSES;
  }

  const response = responseMap[category] || responseMap["default"];

  // If the student has asked follow-up questions (chat history > 0),
  // add a personalized prefix to make it feel conversational
  if (params.chatHistory.length > 0) {
    return `Great follow-up question! Let me help with that.\n\n${response}`;
  }

  return response;
}

// ---------------------------------------------------------------------------
// Input Validation
// ---------------------------------------------------------------------------

/**
 * Validate student input before sending to the AI tutor.
 *
 * Checks:
 *   - Input is not empty or too short (minimum 3 characters)
 *   - Input does not exceed maximum length (2000 characters)
 *   - Basic content check (not just whitespace)
 *
 * @param input - The student's question text
 * @returns Validation result with optional reason for rejection
 */
export function validateInput(input: string): { valid: boolean; reason?: string } {
  // Check for null/undefined
  if (!input) {
    return { valid: false, reason: "Please type a question before sending." };
  }

  // Trim and check for empty/whitespace-only input
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { valid: false, reason: "Please type a question before sending." };
  }

  // Check minimum length (too short to be a real question)
  if (trimmed.length < 3) {
    return {
      valid: false,
      reason: "Your question is too short. Try asking a complete question so I can help you better!",
    };
  }

  // Check maximum length
  if (trimmed.length > 2000) {
    return {
      valid: false,
      reason: `Your message is too long (${trimmed.length} characters). Please keep it under 2,000 characters.`,
    };
  }

  // All checks passed
  return { valid: true };
}
