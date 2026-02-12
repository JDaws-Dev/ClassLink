# ClassLinker

A Google Classroom dashboard for students -- one unified inbox for assignments, comments, and returned work, with an AI tutor that helps you understand (not cheat on) your homework.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth.js with Google OAuth
- **Database**: Convex (real-time backend)
- **AI**: OpenAI GPT-4o-mini (Socratic tutor)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Animation**: Framer Motion

## Prerequisites

- Node.js 18+ and npm
- A Google Cloud account (for Classroom API credentials)
- An OpenAI API key (for the AI Tutor feature)
- A Convex account (for the real-time database)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/classlinker.git
cd classlinker

# 2. Install dependencies
npm install

# 3. Copy the environment template and fill in your keys
cp .env.example .env.local
# Edit .env.local with your actual API keys (see "API Keys Setup" below)

# 4. Start Convex (in a separate terminal)
npx convex dev

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    api/
      auth/[...nextauth]/route.ts  -- Google OAuth via NextAuth
      ai/explain/route.ts          -- AI Tutor endpoint
      sync/route.ts                -- Classroom data sync endpoint
    dashboard/                     -- Main dashboard pages
    globals.css                    -- Global styles
  lib/
    mock-data.ts                   -- Types and mock data for development
    google-classroom.ts            -- Google Classroom API wrappers
    ai-tutor.ts                    -- AI Tutor logic and prompts
    utils.ts                       -- Shared utilities
  components/                      -- Reusable UI components
```

## API Keys Setup

### Google Cloud Console (OAuth + Classroom API)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services > Library**
4. Search for and enable the **Google Classroom API**
5. Go to **APIs & Services > Credentials**
6. Click **Create Credentials > OAuth 2.0 Client ID**
7. Select **Web application** as the application type
8. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
9. Copy the **Client ID** and **Client Secret** into your `.env.local`

Required OAuth scopes (configured automatically in the app):
- `classroom.courses.readonly`
- `classroom.coursework.me.readonly`
- `classroom.student-submissions.me.readonly`
- `classroom.rosters.readonly`

### OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Create a new secret key
4. Copy it into `OPENAI_API_KEY` in your `.env.local`

### Convex Setup

1. Sign up at [convex.dev](https://convex.dev)
2. Run `npx convex init` in the project root
3. Run `npx convex dev` to start the local development backend
4. The deployment URL will be printed in the terminal -- copy it to `NEXT_PUBLIC_CONVEX_URL` in your `.env.local`

### NextAuth Secret

Generate a secure random secret for JWT encryption:

```bash
openssl rand -base64 32
```

Copy the output into `NEXTAUTH_SECRET` in your `.env.local`.

## Current Status

**MVP -- running with mock data.** Connect your API keys to go live.

The app is fully functional with mock data for development and demonstration. All UI components, navigation, and the AI Tutor work out of the box without any API keys. To connect to real Google Classroom data:

1. Set up Google OAuth credentials (see above)
2. Replace the mock data calls in `src/lib/google-classroom.ts` with real API calls
3. Set up Convex for persistent storage
4. Add your OpenAI key to enable the real AI Tutor

## Note

This is a student project built to explore Next.js 14, real-time databases, and AI integration. It is not affiliated with Google or Google Classroom.
