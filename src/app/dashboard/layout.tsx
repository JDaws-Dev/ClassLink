"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const mockUser = { name: "Alex Johnson", avatarUrl: "" };

const mockCourses = [
  { id: "c1", name: "Algebra 1", color: "#7C3AED" },
  { id: "c2", name: "English LA 8", color: "#2563EB" },
  { id: "c3", name: "US History", color: "#10B981" },
  { id: "c4", name: "Science 8", color: "#F59E0B" },
];

const unseenCount = 5;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      {/* Desktop sidebar - always visible on lg+ */}
      <aside className="hidden lg:flex lg:w-[280px] lg:shrink-0">
        <div className="flex w-[280px] flex-col">
          <Sidebar
            user={mockUser}
            courses={mockCourses}
            unseenCount={unseenCount}
          />
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sliding sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
            >
              <Sidebar
                user={mockUser}
                courses={mockCourses}
                unseenCount={unseenCount}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={mockUser}
          unseenCount={unseenCount}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
