"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  BookOpen,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  user: { name: string; avatarUrl: string };
  courses: Course[];
  unseenCount: number;
  onClose?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Sidebar({ user, courses, unseenCount, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-100">
      {/* Logo area */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">
          ClassLinker
        </span>
        {/* Close button for mobile overlay */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Main links */}
        <div className="space-y-1">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/dashboard"
                ? "bg-violet-50 text-violet-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Inbox
              className={cn(
                "h-[18px] w-[18px] shrink-0",
                pathname === "/dashboard" ? "text-violet-600" : "text-gray-400"
              )}
            />
            Inbox
            {unseenCount > 0 && (
              <Badge
                variant="default"
                className="ml-auto h-5 min-w-[20px] justify-center px-1.5 py-0 text-[11px]"
              >
                {unseenCount}
              </Badge>
            )}
          </Link>
        </div>

        {/* Classes section */}
        <div className="mt-8">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            My Classes
          </p>
          <div className="space-y-0.5">
            {courses.map((course) => (
              <Link
                key={course.id}
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <span className="truncate">{course.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 p-3 space-y-1">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
          <Settings className="h-[18px] w-[18px] text-gray-400" />
          Settings
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Avatar className="h-8 w-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {user.name}
            </p>
          </div>
          <button
            className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500 transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
