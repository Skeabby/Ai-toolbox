# Contributing to AI Survival Toolkit

Thank you for your interest! This project welcomes contributions of all kinds — bug fixes, new features, documentation improvements, and design suggestions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Adding a New Tool](#adding-a-new-tool)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

Be kind, be respectful, be constructive. We have zero tolerance for harassment of any kind.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account (free)
- A [Google AI Studio](https://aistudio.google.com) account for Gemini API key (free)

### Setup

```bash
# 1. Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/ai-survival-toolkit.git
cd ai-survival-toolkit

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL, anon key, and Gemini API key

# 4. Run the database schema
# Go to supabase.com → your project → SQL Editor
# Paste and run the contents of: supabase/migrations/001_initial_schema.sql

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Development Workflow

1. **Create a branch** from `main` using the naming convention below
2. **Make your changes** — keep each PR focused on one thing
3. **Run type checking** before pushing: `npm run type-check`
4. **Run lint**: `npm run lint`
5. **Open a Pull Request** against `main`

---

## Branch Naming

| Type        | Pattern                     | Example                          |
|-------------|----------------------------|----------------------------------|
| Feature     | `feat/short-description`    | `feat/flashcard-spaced-repeat`   |
| Bug fix     | `fix/short-description`     | `fix/pdf-upload-crash`           |
| Docs        | `docs/short-description`    | `docs/update-setup-guide`        |
| Refactor    | `refactor/short-description`| `refactor/gemini-client`         |
| UI/Style    | `ui/short-description`      | `ui/dashboard-mobile-layout`     |

---

## Commit Messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): short description

Optional longer description.

Fixes #123
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

**Examples:**
```
feat(quiz): add difficulty selector to quiz generator
fix(pdf): handle password-protected PDFs gracefully
docs(readme): add Supabase storage setup instructions
```

---

## Pull Request Process

1. Fill in the PR template completely
2. Link any related issues using `Fixes #N` or `Closes #N`
3. Ensure `npm run type-check` and `npm run lint` pass with no errors
4. Add a short description of what changed and why
5. Screenshots or screen recordings are appreciated for UI changes
6. A maintainer will review within 3–5 days

PRs that break the TypeScript types, introduce console errors in production, or remove existing tests will not be merged until fixed.

---

## Code Style

- **TypeScript** everywhere — no `any` unless genuinely unavoidable (add `// eslint-disable-line` with a comment explaining why)
- **Tailwind CSS** for all styling — no inline `style` props in `.tsx` files except for dynamic values (e.g. chart bar heights)
- **Server Components by default** — only add `"use client"` when state, effects, or browser APIs are required
- **One component per file** — export the component as the default export
- **Prompts live in `lib/ai/prompts.ts`** — never hardcode system prompts inside API routes
- **API routes follow the pattern** in `app/api/ai/improve-prompt/route.ts`: auth → rate limit → validate → call AI → sanitise → return

---

## Adding a New Tool

The whole tool card system is data-driven. To add a new tool to the dashboard:

1. **Add one entry** to the `tools` array in `lib/data/tools.ts`
2. **Create the page** at `app/(dashboard)/your-tool/page.tsx`
3. **Create the API route** at `app/api/ai/your-tool/route.ts` (if it needs AI)
4. **Add the prompt** to `lib/ai/prompts.ts`
5. **Update the Sidebar** nav list in `components/layout/Sidebar.tsx`

That's it. The card appears in the grid, search, and category filters automatically.

---

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- Steps to reproduce (numbered)
- Expected behaviour
- Actual behaviour
- Browser + OS
- Error messages or screenshots

---

## Feature Requests

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Include:

- The problem you're trying to solve
- Your proposed solution
- Alternatives you considered
- Whether you'd be willing to implement it

---

## Questions?

Open a [Discussion](https://github.com/your-username/ai-survival-toolkit/discussions) rather than an Issue for general questions. We're happy to help.
