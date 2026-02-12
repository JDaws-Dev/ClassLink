"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AITutor } from "@/components/detail/ai-tutor";

// ========== Mock Data ==========

interface MockItem {
  id: string;
  title: string;
  type: "assignment" | "private_comment" | "returned_work";
  courseName: string;
  courseColor: string;
  isSeen: boolean;
  dueDate?: string;
  isOverdue?: boolean;
  grade?: string;
  teacherName?: string;
  alternateLink: string;
  createdAt: string;
  description: string;
  comments?: { author: string; role: "teacher" | "student"; text: string; time: string }[];
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const mockItemsMap: Record<string, MockItem> = {
  "item-1": {
    id: "item-1",
    title: "Chapter 5: Exponents Practice",
    type: "assignment",
    courseName: "Algebra 1",
    courseColor: "#7C3AED",
    isSeen: false,
    dueDate: daysFromNow(1),
    isOverdue: false,
    teacherName: "Mrs. Chen",
    alternateLink: "https://classroom.google.com/c/abc123/a/def456",
    createdAt: daysFromNow(-1),
    description:
      "Complete problems 1-25 on page 142 of your textbook. This assignment covers the following concepts:\n\n- Multiplying with exponents\n- Dividing with exponents\n- Negative exponents\n- Zero exponent rule\n\nPlease show ALL of your work for full credit. You may use a calculator for checking your answers, but you must write out each step.\n\nRemember: An exponent tells you how many times to use the base as a factor. For example, 3\u2074 = 3 \u00D7 3 \u00D7 3 \u00D7 3 = 81.\n\nIf you have questions, post them in the class stream or come to office hours (Tuesday & Thursday, 3:00-3:30 PM).",
  },
  "item-2": {
    id: "item-2",
    title: "Ms. Rivera left a comment on your essay",
    type: "private_comment",
    courseName: "English LA 8",
    courseColor: "#2563EB",
    isSeen: false,
    teacherName: "Ms. Rivera",
    alternateLink: "https://classroom.google.com/c/abc123/a/ghi789",
    createdAt: daysFromNow(0),
    description: "Private comment thread regarding your Romeo & Juliet Essay outline.",
    comments: [
      {
        author: "Ms. Rivera",
        role: "teacher",
        text: "Great intro paragraph! Can you expand on your thesis statement a bit more? I want to see a clearer argument about how fate drives the plot. Also, check your citation format on paragraph 2 \u2014 it should be (Shakespeare, Act 2, Scene 3).",
        time: "Today at 9:15 AM",
      },
      {
        author: "Alex Johnson",
        role: "student",
        text: "Thanks Ms. Rivera! I\u2019ll revise the thesis to be more specific about fate vs. free will. Should I also add more textual evidence in the body paragraphs?",
        time: "Today at 10:30 AM",
      },
      {
        author: "Ms. Rivera",
        role: "teacher",
        text: "Yes, aim for at least 2 quotes per body paragraph. You\u2019re on the right track \u2014 keep it up! Let me know if you need help finding quotes.",
        time: "Today at 11:02 AM",
      },
    ],
  },
  "item-3": {
    id: "item-3",
    title: "Civil War Timeline Project",
    type: "assignment",
    courseName: "US History",
    courseColor: "#10B981",
    isSeen: true,
    dueDate: daysFromNow(3),
    isOverdue: false,
    teacherName: "Mr. Williams",
    alternateLink: "https://classroom.google.com/c/abc123/a/jkl012",
    createdAt: daysFromNow(-2),
    description:
      "Create an illustrated timeline of key Civil War events from 1861-1865.\n\nYour timeline must include:\n- At least 12 major events (battles, legislation, key moments)\n- A brief description (2-3 sentences) for each event\n- At least 4 images or illustrations\n- Color coding: Union events in blue, Confederate events in gray, legislation in red\n\nYou may create your timeline digitally (Google Slides, Canva) or on paper (use poster board). If digital, share it with me through Google Classroom.\n\nGrading rubric:\n- Accuracy of dates and events: 30 points\n- Descriptions and detail: 30 points\n- Visual presentation: 20 points\n- Creativity and effort: 20 points\n\nTotal: 100 points",
  },
  "item-4": {
    id: "item-4",
    title: "Lab Report: Photosynthesis",
    type: "returned_work",
    courseName: "Science 8",
    courseColor: "#F59E0B",
    isSeen: true,
    grade: "92/100",
    teacherName: "Mr. Patel",
    alternateLink: "https://classroom.google.com/c/abc123/a/mno345",
    createdAt: daysFromNow(-1),
    description:
      "Your photosynthesis lab report has been graded and returned.\n\nOverall, excellent work on the experiment! Your hypothesis was well-formed and your data collection was thorough.\n\nAreas of strength:\n- Clear and testable hypothesis\n- Well-organized data tables\n- Good use of scientific vocabulary\n\nAreas for improvement:\n- Your conclusion could be stronger \u2014 connect your results back to the hypothesis more explicitly\n- The graph on page 3 is missing axis labels\n- Double-check the units in your calculations (mL vs. L)\n\nKeep up the great work! This shows real growth from your last lab report.",
    comments: [
      {
        author: "Mr. Patel",
        role: "teacher",
        text: "Solid lab report, Alex! Just fix those axis labels on the graph and resubmit for the remaining 8 points if you\u2019d like.",
        time: "Yesterday at 4:00 PM",
      },
    ],
  },
  "item-5": {
    id: "item-5",
    title: "Romeo & Juliet Essay Draft 1",
    type: "assignment",
    courseName: "English LA 8",
    courseColor: "#2563EB",
    isSeen: false,
    dueDate: daysFromNow(-2),
    isOverdue: true,
    teacherName: "Ms. Rivera",
    alternateLink: "https://classroom.google.com/c/abc123/a/pqr678",
    createdAt: daysFromNow(-5),
    description:
      "Write a 5-paragraph essay analyzing the theme of fate in Romeo & Juliet.\n\nEssay requirements:\n- Introduction with a clear thesis statement about fate\n- 3 body paragraphs, each with a different piece of textual evidence\n- Conclusion that restates your thesis and connects to a bigger idea\n- MLA format: double-spaced, 12pt Times New Roman, 1-inch margins\n- Include a Works Cited page\n\nYour essay should answer: How does Shakespeare use the concept of fate to drive the plot of Romeo & Juliet? Consider the prologue, character decisions, and the final act.\n\nMinimum length: 500 words\n\nThis is Draft 1 \u2014 you will have a chance to revise based on feedback before the final draft is due.",
  },
  "item-6": {
    id: "item-6",
    title: "Weekly Vocabulary Quiz #12",
    type: "assignment",
    courseName: "English LA 8",
    courseColor: "#2563EB",
    isSeen: true,
    dueDate: daysFromNow(2),
    isOverdue: false,
    teacherName: "Ms. Rivera",
    alternateLink: "https://classroom.google.com/c/abc123/a/stu901",
    createdAt: daysFromNow(-1),
    description:
      "Study the vocabulary words from Unit 12 for this week\u2019s quiz.\n\nVocabulary words to study:\n1. Benevolent - well-meaning and kindly\n2. Capricious - given to sudden changes of mood\n3. Diligent - showing care and effort in one\u2019s work\n4. Ephemeral - lasting for a very short time\n5. Fervent - having or displaying passionate intensity\n6. Gregarious - fond of company; sociable\n7. Harbinger - a person or thing that announces the approach of another\n8. Intrepid - fearless; adventurous\n9. Juxtapose - to place close together for contrast\n10. Kindle - to light or set on fire; to arouse\n\nThe quiz will include:\n- Matching definitions (10 points)\n- Fill-in-the-blank sentences (10 points)\n- Write your own sentence for 3 words (15 points)",
  },
  "item-7": {
    id: "item-7",
    title: "Mr. Patel commented on your lab report",
    type: "private_comment",
    courseName: "Science 8",
    courseColor: "#F59E0B",
    isSeen: false,
    teacherName: "Mr. Patel",
    alternateLink: "https://classroom.google.com/c/abc123/a/vwx234",
    createdAt: daysFromNow(0),
    description: "Comment thread about your recent Periodic Table assignment.",
    comments: [
      {
        author: "Mr. Patel",
        role: "teacher",
        text: "Please redo the data table on page 2 \u2014 some values look off. Specifically, check the atomic masses for elements 15-20. I think you may have swapped a couple of them.",
        time: "Today at 8:45 AM",
      },
      {
        author: "Alex Johnson",
        role: "student",
        text: "Oh I see it now! I accidentally wrote Phosphorus\u2019s mass for Sulfur. I\u2019ll fix it and resubmit tonight.",
        time: "Today at 12:15 PM",
      },
    ],
  },
  "item-8": {
    id: "item-8",
    title: "Quadratic Equations Worksheet",
    type: "returned_work",
    courseName: "Algebra 1",
    courseColor: "#7C3AED",
    isSeen: true,
    grade: "85/100",
    teacherName: "Mrs. Chen",
    alternateLink: "https://classroom.google.com/c/abc123/a/yza567",
    createdAt: daysFromNow(-3),
    description:
      "Your Quadratic Equations Worksheet has been graded.\n\nYou did well overall! Most of your factoring was correct, and your work was neatly organized.\n\nDetailed feedback:\n- Problems 1-5 (basic factoring): 25/25 - Perfect!\n- Problems 6-10 (factoring with leading coefficients): 20/25 - Review #8 and #9\n- Problems 11-15 (quadratic formula): 22/25 - Small arithmetic error on #14\n- Problems 16-20 (word problems): 18/25 - Work on setting up equations from word problems\n\nTip: For problem #8, remember to factor out the GCF first before trying to factor the trinomial. That makes it much easier!",
  },
  "item-9": {
    id: "item-9",
    title: "Declaration of Independence Analysis",
    type: "assignment",
    courseName: "US History",
    courseColor: "#10B981",
    isSeen: false,
    dueDate: daysFromNow(0),
    isOverdue: false,
    teacherName: "Mr. Williams",
    alternateLink: "https://classroom.google.com/c/abc123/a/bcd890",
    createdAt: daysFromNow(-1),
    description:
      "Read the primary source document (Declaration of Independence) and answer the 10 comprehension questions on the attached worksheet.\n\nFocus areas:\n- The Preamble and its key ideas about natural rights\n- The list of grievances against King George III\n- The concluding statement of independence\n\nUse specific quotes from the document to support your answers. Each answer should be 3-5 sentences long.\n\nBonus question (5 extra points): How do the ideas in the Declaration of Independence connect to issues in America today? Give one specific example.",
  },
  "item-10": {
    id: "item-10",
    title: "Periodic Table Coloring Activity",
    type: "assignment",
    courseName: "Science 8",
    courseColor: "#F59E0B",
    isSeen: true,
    dueDate: daysFromNow(5),
    isOverdue: false,
    teacherName: "Mr. Patel",
    alternateLink: "https://classroom.google.com/c/abc123/a/efg123",
    createdAt: daysFromNow(-2),
    description:
      "Color-code the periodic table by element groups using the legend provided in the attached PDF.\n\nColor guide:\n- Alkali metals: Red\n- Alkaline earth metals: Orange\n- Transition metals: Yellow\n- Post-transition metals: Light green\n- Metalloids: Teal/Cyan\n- Nonmetals: Blue\n- Halogens: Purple\n- Noble gases: Pink\n\nFor each group, write 2-3 common properties that elements in that group share.\n\nYou may print the blank periodic table from the attachment or draw your own. Use colored pencils, markers, or a digital tool.",
  },
};

export const mockItemIds = Object.keys(mockItemsMap);

// ========== Helper Components ==========

function getTypeIcon(type: MockItem["type"]) {
  switch (type) {
    case "assignment":
      return <FileText className="h-4 w-4" />;
    case "private_comment":
      return <MessageSquare className="h-4 w-4" />;
    case "returned_work":
      return <CheckCircle2 className="h-4 w-4" />;
  }
}

function getTypeLabel(type: MockItem["type"]) {
  switch (type) {
    case "assignment":
      return "Assignment";
    case "private_comment":
      return "Private Comment";
    case "returned_work":
      return "Returned Work";
  }
}

function getTypeBadgeVariant(type: MockItem["type"]): "default" | "secondary" | "accent" {
  switch (type) {
    case "assignment":
      return "default";
    case "private_comment":
      return "secondary";
    case "returned_work":
      return "accent";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDueLabel(dueDate: string, isOverdue?: boolean): { text: string; color: string } {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (isOverdue) {
    return { text: `Overdue (was due ${formatDate(dueDate)})`, color: "text-rose-600" };
  }
  if (diffDays === 0) {
    return { text: "Due today", color: "text-amber-600" };
  }
  if (diffDays === 1) {
    return { text: `Due tomorrow (${formatDate(dueDate)})`, color: "text-amber-600" };
  }
  return { text: `Due ${formatDate(dueDate)}`, color: "text-gray-600" };
}

// ========== Main Component ==========

export default function ItemDetail() {
  const params = useParams();
  const id = params.id as string;
  const item = mockItemsMap[id];
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!item) return;
    try {
      await navigator.clipboard.writeText(item.alternateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="mb-4 rounded-2xl bg-gray-100 p-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700">Item not found</h2>
        <p className="mt-1 text-sm text-gray-400">
          This item doesn&apos;t exist or has been removed.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inbox
          </Button>
        </Link>
      </div>
    );
  }

  const dueInfo = item.dueDate
    ? formatDueLabel(item.dueDate, item.isOverdue)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
    >
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-violet-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inbox
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: Main Content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            {/* Course badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.courseColor }}
              />
              <span className="text-sm font-medium text-gray-500">
                {item.courseName}
              </span>
              {item.teacherName && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-400">
                    {item.teacherName}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {item.title}
            </h1>

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant={getTypeBadgeVariant(item.type)}>
                <span className="mr-1">{getTypeIcon(item.type)}</span>
                {getTypeLabel(item.type)}
              </Badge>

              {item.grade && (
                <Badge variant="accent">
                  Grade: {item.grade}
                </Badge>
              )}

              {dueInfo && (
                <div className={cn("flex items-center gap-1.5 text-sm font-medium", dueInfo.color)}>
                  {item.isOverdue ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {dueInfo.text}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 rounded-lg bg-gray-50 border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                {item.type === "returned_work" ? "Teacher Feedback" : "Instructions"}
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </div>
            </div>

            {/* Comment thread */}
            {item.comments && item.comments.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Comment Thread
                </h2>
                <div className="space-y-3">
                  {item.comments.map((comment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={cn(
                        "rounded-lg border p-4",
                        comment.role === "teacher"
                          ? "border-blue-100 bg-blue-50/50"
                          : "border-gray-100 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold",
                            comment.role === "teacher"
                              ? "bg-blue-500"
                              : "bg-violet-500"
                          )}
                        >
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">
                            {comment.author}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            {comment.time}
                          </span>
                        </div>
                        {comment.role === "teacher" && (
                          <Badge variant="secondary" className="ml-auto text-[10px] px-2 py-0">
                            Teacher
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pl-9">
                        {comment.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Panel + AI Tutor */}
        <div className="lg:w-[340px] shrink-0 space-y-4">
          {/* Action buttons card */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Actions</h3>

            <a
              href={item.alternateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Classroom
            </a>

            <button
              onClick={handleCopyLink}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98]",
                copied
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {/* AI Tutor */}
          <AITutor
            assignmentTitle={item.title}
            assignmentDescription={item.description}
          />
        </div>
      </div>
    </motion.div>
  );
}
