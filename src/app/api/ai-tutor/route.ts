import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_TUTOR_SYSTEM_PROMPT, validateInput } from "@/lib/ai-tutor";
import type { HelpLevel } from "@/lib/ai-tutor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const body = await req.json();
    const {
      assignmentTitle,
      assignmentDescription,
      studentQuestion,
      helpLevel,
      chatHistory,
    } = body as {
      assignmentTitle: string;
      assignmentDescription: string;
      studentQuestion: string;
      helpLevel: HelpLevel;
      chatHistory: { role: string; content: string }[];
    };

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
      { role: "system", content: systemPrompt },
      ...chatHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: studentQuestion },
    ];

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
              : `OpenAI error: ${error.message}`;
      return NextResponse.json({ error: message }, { status: error.status || 500 });
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
