"use client";

import { cn } from "@/lib/utils";

export type FilterType = "all" | "unread" | "due-soon" | "overdue";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCourse: string;
  onCourseChange: (course: string) => void;
  courses: { id: string; name: string; color: string }[];
  counts: {
    all: number;
    unread: number;
    dueSoon: number;
    overdue: number;
  };
}

const filters: {
  key: FilterType;
  label: string;
  countKey: keyof FilterBarProps["counts"];
}[] = [
  { key: "all", label: "All", countKey: "all" },
  { key: "unread", label: "Unread", countKey: "unread" },
  { key: "due-soon", label: "Due Soon", countKey: "dueSoon" },
  { key: "overdue", label: "Overdue", countKey: "overdue" },
];

export function FilterBar({
  activeFilter,
  onFilterChange,
  activeCourse,
  onCourseChange,
  courses,
  counts,
}: FilterBarProps) {
  return (
    <div className="space-y-3 px-4 py-4 sm:px-6">
      {/* Type filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = counts[filter.countKey];
          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-violet-200 hover:text-violet-700 hover:bg-violet-50"
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Course filter dropdown */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Class:
        </label>
        <select
          value={activeCourse}
          onChange={(e) => onCourseChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 cursor-pointer"
        >
          <option value="all">All Classes</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
