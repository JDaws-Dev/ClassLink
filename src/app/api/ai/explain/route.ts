// =============================================================================
// ClassLinker - AI Tutor Explain Endpoint
// =============================================================================
// POST /api/ai/explain
//
// Accepts a student's question about an assignment and returns an AI-generated
// tutoring response using the Socratic method (guides, doesn't give answers).
//
// Request body:
//   {
//     assignmentTitle: string;        - Title of the assignment
//     assignmentDescription: string;  - Full assignment description/instructions
//     studentQuestion: string;        - The student's question
//     helpLevel: "explain" | "hint" | "walkthrough";
//     chatHistory: { role: string; content: string }[];
//   }
//
// Responses:
//   200 - { response: string }
//   400 - { error: string } (validation failure)
//   500 - { error: string } (server error)
//
// TODO: Add rate limiting
//   - Suggested: 20 requests per minute per user
//   - Use a middleware like `@upstash/ratelimit` with Redis, or
//     implement a simple in-memory rate limiter for development
//   - Track by user session/IP to prevent abuse
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  getAITutorResponse,
  validateInput,
  type HelpLevel,
} from "@/lib/ai-tutor";

// ---------------------------------------------------------------------------
// Valid help levels
// ---------------------------------------------------------------------------

const VALID_HELP_LEVELS: HelpLevel[] = ["explain", "hint", "walkthrough"];

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // TODO: Add rate limiting here
    // Example with @upstash/ratelimit:
    //   const ratelimit = new Ratelimit({
    //     redis: Redis.fromEnv(),
    //     limiter: Ratelimit.slidingWindow(20, "1 m"),
    //   });
    //   const { success } = await ratelimit.limit(userId || ip);
    //   if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    // TODO: Authenticate the user via NextAuth session
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Parse the request body
    let body: {
      assignmentTitle?: string;
      assignmentDescription?: string;
      studentQuestion?: string;
      helpLevel?: string;
      chatHistory?: { role: string; content: string }[];
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const {
      assignmentTitle,
      assignmentDescription,
      studentQuestion,
      helpLevel,
      chatHistory,
    } = body;

    // ---- Validate required fields ----

    if (!assignmentTitle || typeof assignmentTitle !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid field: assignmentTitle (string required)." },
        { status: 400 }
      );
    }

    if (!assignmentDescription || typeof assignmentDescription !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid field: assignmentDescription (string required)." },
        { status: 400 }
      );
    }

    if (!studentQuestion || typeof studentQuestion !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid field: studentQuestion (string required)." },
        { status: 400 }
      );
    }

    if (!helpLevel || !VALID_HELP_LEVELS.includes(helpLevel as HelpLevel)) {
      return NextResponse.json(
        {
          error: `Missing or invalid field: helpLevel. Must be one of: ${VALID_HELP_LEVELS.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    if (chatHistory !== undefined && !Array.isArray(chatHistory)) {
      return NextResponse.json(
        { error: "Invalid field: chatHistory must be an array." },
        { status: 400 }
      );
    }

    // ---- Validate student question input ----

    const inputValidation = validateInput(studentQuestion);

    if (!inputValidation.valid) {
      return NextResponse.json(
        { error: inputValidation.reason },
        { status: 400 }
      );
    }

    // ---- Call the AI tutor ----

    const response = await getAITutorResponse({
      assignmentTitle,
      assignmentDescription,
      studentQuestion,
      helpLevel: helpLevel as HelpLevel,
      chatHistory: chatHistory || [],
    });

    return NextResponse.json(
      { response },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/ai/explain] Unexpected error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
