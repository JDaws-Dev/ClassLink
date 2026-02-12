"use client";

import { useState, useMemo } from "react";
import { FilterBar, type FilterType } from "@/components/dashboard/filter-bar";
import { InboxList, type InboxItem } from "@/components/dashboard/inbox-list";

const mockCourses = [
  { id: "c1", name: "Algebra 1", color: "#7C3AED" },
  { id: "c2", name: "English LA 8", color: "#2563EB" },
  { id: "c3", name: "US History", color: "#10B981" },
  { id: "c4", name: "Science 8", color: "#F59E0B" },
];

// Helper to get dates relative to "now"
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const mockItems: InboxItem[] = [
  {
    id: "item-1",
    title: "Chapter 5: Exponents Practice",
    type: "assignment",
    courseName: "Algebra 1",
    courseColor: "#7C3AED",
    isSeen: false,
    dueDate: daysFromNow(1),
    isOverdue: false,
    snippet: "Complete problems 1-25 on page 142. Show all work.",
    alternateLink: "https://classroom.google.com/c/abc123/a/def456",
    createdAt: daysFromNow(-1),
  },
  {
    id: "item-2",
    title: "Ms. Rivera left a comment on your essay",
    type: "private_comment",
    courseName: "English LA 8",
    courseColor: "#2563EB",
    isSeen: false,
    teacherName: "Ms. Rivera",
    snippet: "Great intro paragraph! Can you expand on your thesis statement a bit more?",
    alternateLink: "https://classroom.google.com/c/abc123/a/ghi789",
    createdAt: daysFromNow(0),
  },
  {
    id: "item-3",
    title: "Civil War Timeline Project",
    type: "assignment",
    courseName: "US History",
    courseColor: "#10B981",
    isSeen: true,
    dueDate: daysFromNow(3),
    isOverdue: false,
    snippet: "Create an illustrated timeline of key Civil War events from 1861-1865.",
    alternateLink: "https://classroom.google.com/c/abc123/a/jkl012",
    createdAt: daysFromNow(-2),
  },
  {
    id: "item-4",
    title: "Lab Report: Photosynthesis",
    type: "returned_work",
    courseName: "Science 8",
    courseColor: "#F59E0B",
    isSeen: true,
    grade: "92/100",
    teacherName: "Mr. Patel",
    snippet: "Nice work on the hypothesis section. See my notes on the conclusion.",
    alternateLink: "https://classroom.google.com/c/abc123/a/mno345",
    createdAt: daysFromNow(-1),
  },
  {
    id: "item-5",
    title: "Romeo & Juliet Essay Draft 1",
    type: "assignment",
    courseName: "English LA 8",
    courseColor: "#2563EB",
    isSeen: false,
    dueDate: daysFromNow(-2),
    isOverdue: true,
    snippet: "Write a 5-paragraph essay analyzing the theme of fate in Romeo & Juliet.",
    alternateLink: "https://classroom.google.com/c/abc123/a/pqr678",
    createdAt: daysFromNow(-5),
  },
  {
    id: "item-6",
    title: "Weekly Vocabulary Quiz #12",
    type: "assignment",
    courseName: "English LA 8",
    courseColor: "#2563EB",
    isSeen: true,
    dueDate: daysFromNow(2),
    isOverdue: false,
    snippet: "Study vocabulary words from Unit 12. Quiz will cover definitions and usage.",
    alternateLink: "https://classroom.google.com/c/abc123/a/stu901",
    createdAt: daysFromNow(-1),
  },
  {
    id: "item-7",
    title: "Mr. Patel commented on your lab report",
    type: "private_comment",
    courseName: "Science 8",
    courseColor: "#F59E0B",
    isSeen: false,
    teacherName: "Mr. Patel",
    snippet: "Please redo the data table on page 2 — some values look off.",
    alternateLink: "https://classroom.google.com/c/abc123/a/vwx234",
    createdAt: daysFromNow(0),
  },
  {
    id: "item-8",
    title: "Quadratic Equations Worksheet",
    type: "returned_work",
    courseName: "Algebra 1",
    courseColor: "#7C3AED",
    isSeen: true,
    grade: "85/100",
    teacherName: "Mrs. Chen",
    snippet: "Good effort! Review problems 8 and 14 — check your factoring steps.",
    alternateLink: "https://classroom.google.com/c/abc123/a/yza567",
    createdAt: daysFromNow(-3),
  },
  {
    id: "item-9",
    title: "Declaration of Independence Analysis",
    type: "assignment",
    courseName: "US History",
    courseColor: "#10B981",
    isSeen: false,
    dueDate: daysFromNow(0),
    isOverdue: false,
    snippet: "Read the primary source document and answer the 10 comprehension questions.",
    alternateLink: "https://classroom.google.com/c/abc123/a/bcd890",
    createdAt: daysFromNow(-1),
  },
  {
    id: "item-10",
    title: "Periodic Table Coloring Activity",
    type: "assignment",
    courseName: "Science 8",
    courseColor: "#F59E0B",
    isSeen: true,
    dueDate: daysFromNow(5),
    isOverdue: false,
    snippet: "Color-code the periodic table by element groups. Use the legend provided.",
    alternateLink: "https://classroom.google.com/c/abc123/a/efg123",
    createdAt: daysFromNow(-2),
  },
];

function isDueSoon(item: InboxItem): boolean {
  if (!item.dueDate || item.isOverdue) return false;
  const due = new Date(item.dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 3;
}

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeCourse, setActiveCourse] = useState<string>("all");

  // Apply course filter first (used for counting within a course scope)
  const courseFiltered = useMemo(() => {
    if (activeCourse === "all") return mockItems;
    return mockItems.filter((item) => item.courseName === activeCourse);
  }, [activeCourse]);

  // Calculate counts based on course-filtered items
  const counts = useMemo(() => {
    return {
      all: courseFiltered.length,
      unread: courseFiltered.filter((i) => !i.isSeen).length,
      dueSoon: courseFiltered.filter((i) => isDueSoon(i)).length,
      overdue: courseFiltered.filter((i) => i.isOverdue).length,
    };
  }, [courseFiltered]);

  // Apply type filter on top of course filter
  const filteredItems = useMemo(() => {
    switch (activeFilter) {
      case "unread":
        return courseFiltered.filter((item) => !item.isSeen);
      case "due-soon":
        return courseFiltered.filter((item) => isDueSoon(item));
      case "overdue":
        return courseFiltered.filter((item) => item.isOverdue);
      default:
        return courseFiltered;
    }
  }, [activeFilter, courseFiltered]);

  return (
    <div className="mx-auto max-w-4xl">
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeCourse={activeCourse}
        onCourseChange={setActiveCourse}
        courses={mockCourses}
        counts={counts}
      />
      <div className="rounded-xl border border-gray-100 bg-white mx-4 mb-6 sm:mx-6 overflow-hidden shadow-sm">
        <InboxList items={filteredItems} />
      </div>
    </div>
  );
}
