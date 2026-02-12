"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type HelpLevel = "explain" | "hint" | "walkthrough";

interface QAPair {
  question: string;
  helpLevel: HelpLevel;
  answer: string;
}

interface AITutorProps {
  assignmentTitle: string;
  assignmentDescription: string;
}

const helpLevelLabels: Record<HelpLevel, string> = {
  explain: "Explain",
  hint: "Hint",
  walkthrough: "Walk-through",
};

const helpLevelDescriptions: Record<HelpLevel, string> = {
  explain: "Get a full explanation of the concept",
  hint: "A gentle nudge in the right direction",
  walkthrough: "Step-by-step breakdown",
};

async function fetchAIResponse(
  assignmentTitle: string,
  assignmentDescription: string,
  studentQuestion: string,
  helpLevel: HelpLevel,
  chatHistory: { role: string; content: string }[]
): Promise<string> {
  const res = await fetch("/api/ai-tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignmentTitle,
      assignmentDescription,
      studentQuestion,
      helpLevel,
      chatHistory,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to get response");
  }

  const data = await res.json();
  return data.response;
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-violet-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </span>
  );
}

export function AITutor({
  assignmentTitle,
  assignmentDescription,
}: AITutorProps) {
  const [helpLevel, setHelpLevel] = useState<HelpLevel>("explain");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<QAPair[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const levels: HelpLevel[] = ["explain", "hint", "walkthrough"];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isLoading]);

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;

    const currentQuestion = question.trim();
    setQuestion("");
    setIsLoading(true);
    setError(null);

    // Build chat history for context
    const apiChatHistory = chatHistory.flatMap((qa) => [
      { role: "user", content: qa.question },
      { role: "assistant", content: qa.answer },
    ]);

    try {
      const response = await fetchAIResponse(
        assignmentTitle,
        assignmentDescription,
        currentQuestion,
        helpLevel,
        apiChatHistory
      );
      setChatHistory((prev) => [
        ...prev,
        { question: currentQuestion, helpLevel, answer: response },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="rounded-xl border border-violet-100 bg-gradient-to-b from-violet-50/80 to-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-violet-100 bg-white/60 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
          <Sparkles className="h-4 w-4 text-violet-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">AI Tutor</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Disclaimer */}
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            I help you understand — I won&apos;t give you the answer!
          </p>
        </div>

        {/* Help level selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Help Level
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setHelpLevel(level)}
                className={cn(
                  "rounded-md px-2 py-2 text-xs font-medium transition-all",
                  helpLevel === level
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                )}
                title={helpLevelDescriptions[level]}
              >
                {helpLevelLabels[level]}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-gray-400">
            {helpLevelDescriptions[helpLevel]}
          </p>
        </div>

        {/* Chat history */}
        {chatHistory.length > 0 && (
          <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-gray-100 bg-white p-3">
            {chatHistory.map((qa, index) => (
              <div key={index} className="space-y-2">
                {/* User question */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-xl rounded-br-sm bg-violet-600 px-3 py-2 text-xs text-white">
                    <p className="leading-relaxed">{qa.question}</p>
                    <span className="mt-1 block text-[10px] text-violet-200">
                      {helpLevelLabels[qa.helpLevel]} mode
                    </span>
                  </div>
                </div>
                {/* AI response */}
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-gray-50 border border-gray-100 px-3 py-2 text-xs text-gray-700">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="h-3 w-3 text-violet-500" />
                        <span className="text-[10px] font-semibold text-violet-600">
                          AI Tutor
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">
                        {qa.answer}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl rounded-bl-sm bg-gray-50 border border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-violet-500" />
                    <LoadingDots />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {/* Loading state when no history yet */}
        {isLoading && chatHistory.length === 0 && (
          <div className="flex justify-center rounded-lg border border-gray-100 bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Thinking
              <LoadingDots />
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Input area */}
        <div className="flex gap-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about this assignment..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || isLoading}
            className={cn(
              "flex h-auto shrink-0 items-center justify-center rounded-lg px-4 text-white transition-all",
              question.trim() && !isLoading
                ? "bg-violet-600 hover:bg-violet-700 active:scale-[0.97] shadow-sm shadow-violet-200"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
