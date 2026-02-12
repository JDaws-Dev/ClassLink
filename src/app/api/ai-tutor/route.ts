import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_TUTOR_SYSTEM_PROMPT, validateInput } from "@/lib/ai-tutor";
import type { HelpLevel } from "@/lib/ai-tutor";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const assignmentTitle = body.assignmentTitle || "";
    const assignmentDescription = body.assignmentDescription || "";
    const studentQuestion = body.studentQuestion || "";
    const helpLevel: HelpLevel = body.helpLevel || "explain";
    const chatHistory: { role: string; content: string }[] =
      Array.isArray(body.chatHistory) ? body.chatHistory : [];

    const validation = validateInput(studentQuestion);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const systemPrompt = `${AI_TUTOR_SYSTEM_PROMPT}

CURRENT CONTEXT:
- Assignment: ${assignmentTitle}
- Description: ${assignmentDescription}
- Help level requested: ${helpLevel}`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system" as const, content: systemPrompt },
      ...chatHistory.map((msg): OpenAI.Chat.ChatCompletionMessageParam => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user" as const, content: studentQuestion },
    ];

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Tutor API error:", error);

    if (error instanceof OpenAI.APIError) {
      const message =
        error.status === 401
          ? "Invalid API key. Please check your OPENAI_API_KEY."
          : error.status === 429
            ? "Rate limit exceeded. Please try again in a moment."
            : error.status === 402 || error.status === 403
              ? "OpenAI billing issue. Check your account at platform.openai.com."
              : `OpenAI error (${error.status}): ${error.message}`;
      return NextResponse.json(
        { error: message },
        { status: error.status || 500 }
      );
    }

    const msg =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Something went wrong: ${msg}` },
      { status: 500 }
    );
  }
}
