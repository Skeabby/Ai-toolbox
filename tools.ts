// ─────────────────────────────────────────────────────────────
//  lib/data/tools.ts
//  Single source of truth for every tool in the app.
//  Add a new entry here and it automatically appears in the grid,
//  sidebar, and search — no other changes needed.
// ─────────────────────────────────────────────────────────────

export type ToolCategory = "all" | "ai" | "study" | "productivity" | "notes";
export type ToolColor =
  | "amber"
  | "violet"
  | "emerald"
  | "blue"
  | "rose"
  | "cyan"
  | "indigo"
  | "orange";

export interface Tool {
  id: string;           // used in URLs: /tools/[id]
  title: string;
  description: string;
  longDescription?: string;
  icon: string;         // Lucide icon name (string), rendered in ToolCard
  category: ToolCategory;
  href: string;         // where the card links to
  color: ToolColor;     // accent color key
  isAI?: boolean;       // shows "AI" badge
  isNew?: boolean;      // shows "New" badge
  comingSoon?: boolean; // card is non-interactive
  shortcut?: string;    // keyboard shortcut hint, e.g. "N"
}

// ── Color palette map ─────────────────────────────────────────
// Centralised so ToolCard, badges, etc. all pull from one place.

export const colorVariants: Record<
  ToolColor,
  {
    iconBg: string;
    iconText: string;
    border: string;
    hoverBorder: string;
    glow: string;
    badge: string;
  }
> = {
  amber: {
    iconBg:      "bg-amber-500/10",
    iconText:    "text-amber-400",
    border:      "border-[#2a2a1a]",
    hoverBorder: "group-hover:border-amber-500/40",
    glow:        "group-hover:shadow-amber-500/10",
    badge:       "bg-amber-500/15 text-amber-300",
  },
  violet: {
    iconBg:      "bg-violet-500/10",
    iconText:    "text-violet-400",
    border:      "border-[#221a2a]",
    hoverBorder: "group-hover:border-violet-500/40",
    glow:        "group-hover:shadow-violet-500/10",
    badge:       "bg-violet-500/15 text-violet-300",
  },
  emerald: {
    iconBg:      "bg-emerald-500/10",
    iconText:    "text-emerald-400",
    border:      "border-[#1a2a22]",
    hoverBorder: "group-hover:border-emerald-500/40",
    glow:        "group-hover:shadow-emerald-500/10",
    badge:       "bg-emerald-500/15 text-emerald-300",
  },
  blue: {
    iconBg:      "bg-blue-500/10",
    iconText:    "text-blue-400",
    border:      "border-[#1a1e2a]",
    hoverBorder: "group-hover:border-blue-500/40",
    glow:        "group-hover:shadow-blue-500/10",
    badge:       "bg-blue-500/15 text-blue-300",
  },
  rose: {
    iconBg:      "bg-rose-500/10",
    iconText:    "text-rose-400",
    border:      "border-[#2a1a1e]",
    hoverBorder: "group-hover:border-rose-500/40",
    glow:        "group-hover:shadow-rose-500/10",
    badge:       "bg-rose-500/15 text-rose-300",
  },
  cyan: {
    iconBg:      "bg-cyan-500/10",
    iconText:    "text-cyan-400",
    border:      "border-[#1a2526]",
    hoverBorder: "group-hover:border-cyan-500/40",
    glow:        "group-hover:shadow-cyan-500/10",
    badge:       "bg-cyan-500/15 text-cyan-300",
  },
  indigo: {
    iconBg:      "bg-indigo-500/10",
    iconText:    "text-indigo-400",
    border:      "border-[#1e1a2a]",
    hoverBorder: "group-hover:border-indigo-500/40",
    glow:        "group-hover:shadow-indigo-500/10",
    badge:       "bg-indigo-500/15 text-indigo-300",
  },
  orange: {
    iconBg:      "bg-orange-500/10",
    iconText:    "text-orange-400",
    border:      "border-[#2a1e1a]",
    hoverBorder: "group-hover:border-orange-500/40",
    glow:        "group-hover:shadow-orange-500/10",
    badge:       "bg-orange-500/15 text-orange-300",
  },
};

// ── Category labels ───────────────────────────────────────────

export const categoryLabels: Record<ToolCategory, string> = {
  all:          "All Tools",
  ai:           "AI-Powered",
  study:        "Study",
  productivity: "Productivity",
  notes:        "Notes",
};

// ── Tool data ─────────────────────────────────────────────────
// To add a new tool: append one object here. That's it.

export const tools: Tool[] = [
  {
    id:              "pdf-summarizer",
    title:           "PDF Summarizer",
    description:     "Upload any PDF and instantly receive a structured summary with key points, extracted using Gemini AI.",
    longDescription: "Upload lecture slides, research papers, or textbooks. The AI extracts text client-side, summarises the content into digestible sections, and highlights the most important concepts. All summaries are saved to your account.",
    icon:            "FileText",
    category:        "ai",
    href:            "/pdf-summarizer",
    color:           "amber",
    isAI:            true,
    shortcut:        "P",
  },
  {
    id:              "quiz-generator",
    title:           "Quiz Generator",
    description:     "Generate multiple-choice quizzes from any topic or your uploaded PDF to test your understanding.",
    longDescription: "Enter a subject, paste some notes, or pick one of your saved PDFs. The AI creates a custom quiz with explanations for every answer so you learn even when you get something wrong.",
    icon:            "HelpCircle",
    category:        "ai",
    href:            "/quiz",
    color:           "violet",
    isAI:            true,
    shortcut:        "Q",
  },
  {
    id:              "flashcards",
    title:           "Flashcards",
    description:     "Create decks manually or let AI generate them from a topic. Study with a built-in spaced repetition system.",
    icon:            "Layers",
    category:        "study",
    href:            "/flashcards",
    color:           "blue",
    isAI:            true,
    shortcut:        "F",
  },
  {
    id:              "notes",
    title:           "Notes",
    description:     "A fast rich-text editor for your study notes, with tags, pinning, and full-text search.",
    icon:            "StickyNote",
    category:        "notes",
    href:            "/notes",
    color:           "emerald",
    shortcut:        "N",
  },
  {
    id:              "study-planner",
    title:           "Study Planner",
    description:     "Organise tasks by subject, set priorities and due dates, and view everything in a weekly calendar.",
    icon:            "CalendarDays",
    category:        "study",
    href:            "/study-planner",
    color:           "indigo",
    shortcut:        "S",
  },
  {
    id:              "productivity",
    title:           "Productivity Tracker",
    description:     "Built-in Pomodoro timer, daily study streaks, session logging, and a weekly progress chart.",
    icon:            "Timer",
    category:        "productivity",
    href:            "/productivity",
    color:           "rose",
    shortcut:        "T",
  },
  {
    id:              "debate-helper",
    title:           "AI Debate Helper",
    description:     "Enter a topic and your position. The AI generates strong arguments and counter-arguments for any essay.",
    icon:            "MessageSquare",
    category:        "ai",
    href:            "/debate",
    color:           "cyan",
    isAI:            true,
    isNew:           true,
    shortcut:        "D",
  },
  {
    id:              "mind-map",
    title:           "Mind Map",
    description:     "Visualise connections between ideas and concepts with an interactive drag-and-drop canvas.",
    icon:            "Network",
    category:        "study",
    href:            "/mind-map",
    color:           "orange",
    isNew:           true,
    comingSoon:      true,
  },
];

// ── Helpers ───────────────────────────────────────────────────

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  if (category === "all") return tools;
  return tools.filter((t) => t.category === category);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}
