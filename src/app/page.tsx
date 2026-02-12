"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" className="mr-3">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-violet-600"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-600"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-500"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

const features = [
  {
    icon: <LinkIcon />,
    title: "One-Click Links",
    description:
      "Jump straight to any assignment, announcement, or comment in Google Classroom with a single click. No more digging through pages.",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    icon: <InboxIcon />,
    title: "Smart Inbox",
    description:
      "All your assignments, comments, and returned work from every class in one clean feed. Filter by class, due date, or type.",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: <SparklesIcon />,
    title: "AI Tutor",
    description:
      "Stuck on a problem? Our AI Tutor gives you hints and explanations without giving away the answer. Learn for real.",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(37, 99, 235, 0.06) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 10%, rgba(124, 58, 237, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 30% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 30%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(37, 99, 235, 0.06) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 shadow-md shadow-violet-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">ClassLink</span>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-300 active:scale-[0.98]"
        >
          Open Dashboard
        </Link>
      </header>

      {/* Hero */}
      <motion.main
        className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Free for students
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
            ClassLink
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-xl font-semibold text-gray-800 sm:text-2xl"
        >
          Never miss a teacher comment again.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg"
        >
          ClassLink pulls all your Google Classroom assignments, comments, and
          grades into one simple inbox so you always know what&apos;s due and
          what your teachers said.
        </motion.p>

        {/* Sign in button */}
        <motion.div variants={itemVariants} className="mt-10">
          <Link href="/dashboard">
            <button className="group inline-flex items-center rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-lg shadow-gray-200/50 transition-all hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/70 active:scale-[0.98]">
              <GoogleIcon />
              Sign in with Google
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-3 transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </Link>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          className="mt-24 grid gap-6 sm:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group rounded-2xl border ${feature.border} ${feature.bg} p-6 text-left transition-shadow hover:shadow-lg`}
            >
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 bg-gray-50/50 py-8 text-center">
        <p className="text-sm font-medium text-gray-500">
          Built for students, by students
        </p>
        <p className="mt-2 text-xs text-gray-400">
          ClassLink is not affiliated with, endorsed by, or sponsored by
          Google. Google Classroom is a trademark of Google LLC.
        </p>
      </footer>
    </div>
  );
}
