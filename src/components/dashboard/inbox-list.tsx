"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface InboxItem {
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
  snippet?: string;
  alternateLink: string;
  createdAt: string;
}

interface InboxListProps {
  items: InboxItem[];
}

function getTypeIcon(type: InboxItem["type"]) {
  switch (type) {
    case "assignment":
      return <FileText className="h-3.5 w-3.5" />;
    case "private_comment":
      return <MessageSquare className="h-3.5 w-3.5" />;
    case "returned_work":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
  }
}

function getTypeLabel(type: InboxItem["type"]) {
  switch (type) {
    case "assignment":
      return "Assignment";
    case "private_comment":
      return "Comment";
    case "returned_work":
      return "Returned";
  }
}

function getTypeColor(type: InboxItem["type"]) {
  switch (type) {
    case "assignment":
      return "text-violet-600 bg-violet-50";
    case "private_comment":
      return "text-blue-600 bg-blue-50";
    case "returned_work":
      return "text-emerald-600 bg-emerald-50";
  }
}

function formatDueDate(dueDate: string, isOverdue?: boolean) {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (isOverdue) {
    return "Overdue";
  }
  if (diffDays === 0) {
    return "Due today";
  }
  if (diffDays === 1) {
    return "Due tomorrow";
  }
  if (diffDays > 0 && diffDays <= 7) {
    return `Due in ${diffDays} days`;
  }
  return `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function InboxList({ items }: InboxListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-2xl bg-violet-50 p-4">
          <CheckCircle2 className="h-8 w-8 text-violet-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700">All caught up!</p>
        <p className="mt-1 text-sm text-gray-400">
          Nothing matches your current filters.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="divide-y divide-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <Link
            href={`/dashboard/item/${item.id}`}
            className={cn(
              "group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-violet-50/50 sm:px-6",
              !item.isSeen && "bg-violet-50/30"
            )}
          >
            {/* Unseen indicator */}
            <div className="flex shrink-0 items-center pt-1.5">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  item.isSeen ? "bg-transparent" : "bg-violet-600"
                )}
              />
            </div>

            {/* Course color bar */}
            <div
              className="mt-1 h-10 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: item.courseColor }}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm",
                      item.isSeen
                        ? "font-medium text-gray-700"
                        : "font-bold text-gray-900"
                    )}
                  >
                    {item.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {/* Type badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        getTypeColor(item.type)
                      )}
                    >
                      {getTypeIcon(item.type)}
                      {getTypeLabel(item.type)}
                    </span>
                    {/* Course name */}
                    <span className="text-xs text-gray-400">
                      {item.courseName}
                    </span>
                    {/* Grade if returned */}
                    {item.grade && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        {item.grade}
                      </span>
                    )}
                  </div>
                  {/* Snippet */}
                  {item.snippet && (
                    <p className="mt-1.5 truncate text-xs text-gray-400">
                      {item.snippet}
                    </p>
                  )}
                </div>

                {/* Right side: due date + arrow */}
                <div className="flex shrink-0 items-center gap-2 pt-0.5">
                  {item.dueDate && (
                    <span
                      className={cn(
                        "hidden items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold sm:inline-flex",
                        item.isOverdue
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-600"
                      )}
                    >
                      {item.isOverdue ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {formatDueDate(item.dueDate, item.isOverdue)}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-violet-500" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
