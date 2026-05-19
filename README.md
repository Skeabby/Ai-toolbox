<div align="center">

# 📚 AI Survival Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Free_Tier-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**The all-in-one AI-powered study companion for students.**

Summarise PDFs · Generate quizzes · Study flashcards · Plan your week · Track productivity · Debate any topic — all in one open-source app, 100% free to deploy.

[Live Demo](#) · [Features](#-features) · [Quick Start](#-quick-start) · [Contributing](CONTRIBUTING.md)

</div>

---

## 🖼 Preview

> A dark, modern dashboard with nine AI-powered tools — built with Next.js 15, Supabase, and Google Gemini Flash.

---

## ✨ Features

| Tool | What it does |
|------|-------------|
| 📄 **PDF Summariser** | Upload any PDF → client-side text extraction → structured AI summary + key points |
| ❓ **Quiz Generator** | Generate multiple-choice quizzes from any topic. Track scores and review mistakes. |
| 🃏 **Flashcards** | AI-generated or manual decks with 3D flip animation and spaced repetition |
| 🗒️ **Notes** | Rich text editor with tags, pinning, auto-save, and Markdown preview |
| 📅 **Study Planner** | Task manager with priorities, due dates, and Today / Upcoming / All views |
| ⏱️ **Productivity Tracker** | Pomodoro timer, session logging, 7-day chart, streak tracking, mood log |
| 💬 **AI Debate Helper** | Enter a topic → AI generates arguments and counter-arguments with evidence |
| 🪄 **Prompt Improver** | Paste any rough prompt → AI rewrites it into a professional, effective version |
| 🤖 **Tool Recommender** | Describe a task → AI recommends the best AI tools, ranked by relevance |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 |
| Auth + DB | [Supabase](https://supabase.com) (free tier) |
| AI | [Google Gemini 1.5 Flash](https://ai.google.dev) (1M tokens/day free) |
| Deployment | [Vercel](https://vercel.com) (hobby plan, free) |
| Icons | [Lucide React](https://lucide.dev) |
| PDF Parsing | [pdfjs-dist](https://mozilla.github.io/pdf.js/) (client-side) |

**Total cost to run: $0/month** on the free tiers of every service above.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Google AI Studio](https://aistudio.google.com) API key (free)

### 1 · Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ai-survival-toolkit.git
cd ai-survival-toolkit
npm install
```

### 2 · Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

```env
# From supabase.com → your project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# From aistudio.google.com → Get API Key (free, no card needed)
GEMINI_API_KEY=AIza...

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3 · Set up the database

In your Supabase project dashboard, go to **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, RLS policies, and triggers automatically.

### 4 · Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

---

## ☁️ Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Then add your environment variables in the Vercel dashboard under **Settings → Environment Variables** (same keys as `.env.local`).

Or click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-survival-toolkit)

---

## 📁 Project Structure

```
ai-survival-toolkit/
├── app/
│   ├── (auth)/           # Login + register pages
│   ├── (dashboard)/      # All protected tool pages
│   │   ├── dashboard/    # Overview stats
│   │   ├── notes/        # Notes CRUD + editor
│   │   ├── pdf-summarizer/
│   │   ├── quiz/
│   │   ├── flashcards/
│   │   ├── study-planner/
│   │   ├── productivity/
│   │   ├── debate/
│   │   ├── prompt-improver/
│   │   ├── readme-generator/
│   │   └── tool-recommender/
│   └── api/              # All API routes
│       ├── ai/           # Gemini-powered endpoints
│       ├── notes/
│       ├── study-tasks/
│       └── productivity/
├── components/           # Reusable UI components
├── lib/
│   ├── ai/               # Gemini client + all prompt templates
│   ├── pdf/              # Client-side PDF text extraction
│   ├── supabase/         # Browser + server Supabase clients
│   └── utils/            # Validation, markdown, storage helpers
├── supabase/migrations/  # SQL schema (run once in Supabase)
└── types/                # TypeScript + Supabase DB types
```

---

## 🔒 Security

- **All AI API keys are server-only** — `GEMINI_API_KEY` is never sent to the browser
- **Row Level Security (RLS)** enforced on every Supabase table — users can only access their own data
- **Auth middleware** protects all dashboard routes, redirecting unauthenticated requests to `/login`
- **Rate limiting** on every AI endpoint — 5–15 requests per user per minute (in-memory, upgradeable to Redis)
- **Input validation and sanitisation** on all API routes before any AI call

---

## 🔑 Environment Variables

| Variable | Required | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase dashboard → Settings → API |
| `GEMINI_API_KEY` | ✅ | [aistudio.google.com](https://aistudio.google.com) → Get API Key |
| `GROQ_API_KEY` | ❌ | [console.groq.com](https://console.groq.com) — optional fallback AI |
| `NEXT_PUBLIC_APP_URL` | ❌ | Your production URL (defaults to `http://localhost:3000`) |

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are **server-only**.
> They must never be prefixed with `NEXT_PUBLIC_` and are never exposed to the browser.

---

## 🗺 Roadmap

| Status | Feature |
|--------|---------|
| ✅ | PDF Summariser with client-side text extraction |
| ✅ | MCQ Quiz Generator with score tracking |
| ✅ | Flashcard decks with spaced repetition |
| ✅ | Markdown notes editor with auto-save |
| ✅ | Study Planner with priorities and due dates |
| ✅ | Pomodoro tracker with 7-day chart |
| ✅ | AI Debate Helper |
| ✅ | Prompt Improver |
| ✅ | GitHub README Generator |
| ✅ | AI Tool Recommender with search history |
| 🔜 | Mind map canvas (drag-and-drop) |
| 🔜 | Citation generator (APA, MLA, Harvard) |
| 🔜 | Essay outline builder |
| 🔜 | Collaborative notes (real-time via Supabase Realtime) |
| 🔜 | Mobile app (Expo / React Native) |
| 🔜 | Browser extension for one-click page summarise |
| 💡 | Voice-to-notes transcription (Whisper API) |
| 💡 | Smart study schedule generator |

---

## 🤝 Contributing

Contributions are warmly welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Short version:

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

---

## 📄 License

MIT © 2025 — see [LICENSE](LICENSE) for details.

You're free to use, modify, and distribute this project. A ⭐ star is always appreciated!

---

<div align="center">

Built with ❤️ for students everywhere · Powered by Next.js, Supabase & Google Gemini

</div>
