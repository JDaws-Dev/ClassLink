"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface InboxItemData {
  id: string;
  type: "assignment" | "private_comment" | "returned_work";
  courseName: string;
  title: string;
  subtitle: string;
  timestamp: string;
  isSeen: boolean;
  alternateLink: string;
}

interface InboxItemProps {
  item: InboxItemData;
}

const typeColorMap: Record<InboxItemData["type"], string> = {
  private_comment: "bg-violet-500",
  assignment: "bg-blue-600",
  returned_work: "bg-emerald-500",
};

export function InboxItem({ item }: InboxItemProps) {
  const handleClick = () => {
    window.open(item.alternateLink, "_blank", "noopener,noreferrer");
  };

  const handleGoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(item.alternateLink, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleClick}
      className={cn(
        "flex items-start gap-4 rounded-lg border border-gray-200 p-4 cursor-pointer transition-colors",
        item.isSeen ? "bg-white" : "bg-violet-50 border-violet-100"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Type indicator dot */}
      <div className="mt-2 shrink-0">
        <span
          className={cn(
            "block h-2.5 w-2.5 rounded-full",
            typeColorMap[item.type]
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
          {item.courseName}
        </p>
        <h4
          className={cn(
            "text-sm leading-snug truncate",
            item.isSeen ? "font-medium text-gray-900" : "font-bold text-gray-900"
          )}
        >
          {item.title}
        </h4>
        <p className="mt-0.5 text-sm text-gray-500 truncate">
          {item.subtitle}
        </p>
      </div>

      {/* Right side: timestamp + go button */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {item.timestamp}
        </span>
        <Button
          variant="default"
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={handleGoClick}
        >
          Go
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}
