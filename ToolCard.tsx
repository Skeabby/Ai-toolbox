// ─────────────────────────────────────────────────────────────
//  components/ui/ToolCard.tsx
//  Reusable card for a single tool. Renders an icon, category
//  badge, title, description, and "coming soon" / AI / New
//  badges. Smooth hover: lift, border glow, icon brightens.
//
//  Usage:
//    <ToolCard tool={tool} />              // default
//    <ToolCard tool={tool} loading />      // skeleton state
// ─────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  HelpCircle,
  Layers,
  StickyNote,
  CalendarDays,
  Timer,
  MessageSquare,
  Network,
  LockKeyhole,
} from "lucide-react";
import {
  type Tool,
  type ToolColor,
  colorVariants,
  categoryLabels,
} from "@/lib/data/tools";

// ── Icon registry ─────────────────────────────────────────────
// Maps the string icon name stored in tools.ts to the actual
// Lucide component. Add entries here as you add tools.

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  HelpCircle,
  Layers,
  StickyNote,
  CalendarDays,
  Timer,
  MessageSquare,
  Network,
};

// ── Skeleton (loading state) ──────────────────────────────────

function ToolCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="
        relative overflow-hidden
        rounded-2xl
        border border-[#2a2a3d]
        bg-[#13131c]
        p-5
        animate-pulse
      "
    >
      {/* Icon placeholder */}
      <div className="mb-4 h-11 w-11 rounded-xl bg-[#2a2a3d]" />
      {/* Title placeholder */}
      <div className="mb-2.5 h-4 w-32 rounded-md bg-[#2a2a3d]" />
      {/* Description placeholders */}
      <div className="mb-1.5 h-3 w-full rounded-md bg-[#222230]" />
      <div className="mb-1.5 h-3 w-4/5 rounded-md bg-[#222230]" />
      <div className="h-3 w-3/5 rounded-md bg-[#222230]" />
      {/* Badge placeholder */}
      <div className="mt-4 h-5 w-16 rounded-full bg-[#2a2a3d]" />
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────

interface ToolCardProps {
  tool: Tool;
  loading?: boolean;
}

export default function ToolCard({ tool, loading = false }: ToolCardProps) {
  if (loading) return <ToolCardSkeleton />;

  const colors = colorVariants[tool.color as ToolColor];
  const IconComponent = iconMap[tool.icon] ?? FileText;

  const cardContent = (
    <>
      {/* ── Top row: icon + arrow ── */}
      <div className="mb-4 flex items-start justify-between">
        {/* Icon */}
        <div
          className={`
            flex h-11 w-11 items-center justify-center
            rounded-xl
            ${colors.iconBg}
            transition-all duration-300
            group-hover:scale-110
          `}
        >
          <IconComponent
            className={`h-5 w-5 ${colors.iconText} transition-colors duration-300`}
          />
        </div>

        {/* Arrow — invisible until hover */}
        {!tool.comingSoon && (
          <ArrowUpRight
            className="
              h-4 w-4 text-[#3a3a5a]
              transition-all duration-200
              group-hover:text-[#a09ad0]
              -translate-x-1 opacity-0
              group-hover:translate-x-0 group-hover:opacity-100
            "
          />
        )}

        {/* Lock icon for coming-soon */}
        {tool.comingSoon && (
          <LockKeyhole className="h-4 w-4 text-[#3a3a5a]" aria-hidden />
        )}
      </div>

      {/* ── Title ── */}
      <h3
        className="
          mb-1.5
          text-[15px] font-semibold leading-snug
          text-[#e8e6f0]
          group-hover:text-white
          transition-colors duration-200
        "
      >
        {tool.title}
      </h3>

      {/* ── Description ── */}
      <p className="mb-4 text-[13px] leading-relaxed text-[#7070a0] line-clamp-3">
        {tool.description}
      </p>

      {/* ── Footer: category + badges ── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Category */}
        <span
          className={`
            inline-flex items-center
            rounded-full px-2.5 py-0.5
            text-[11px] font-medium tracking-wide
            ${colors.badge}
          `}
        >
          {categoryLabels[tool.category]}
        </span>

        {/* AI badge */}
        {tool.isAI && (
          <span
            className="
              inline-flex items-center gap-1
              rounded-full bg-[#6c63a8]/15 px-2 py-0.5
              text-[11px] font-medium text-[#9d94d8]
            "
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9d94d8] animate-pulse" />
            AI
          </span>
        )}

        {/* New badge */}
        {tool.isNew && !tool.comingSoon && (
          <span
            className="
              rounded-full bg-emerald-500/15 px-2 py-0.5
              text-[11px] font-medium text-emerald-400
            "
          >
            New
          </span>
        )}

        {/* Coming soon badge */}
        {tool.comingSoon && (
          <span
            className="
              rounded-full bg-[#2a2a3d] px-2 py-0.5
              text-[11px] font-medium text-[#5a5a7a]
            "
          >
            Coming soon
          </span>
        )}
      </div>

      {/* Subtle bottom gradient shimmer on hover */}
      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0
          h-24 rounded-b-2xl
          bg-gradient-to-t from-[#1a1a28]/40 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
      />
    </>
  );

  const sharedClasses = `
    group relative overflow-hidden
    rounded-2xl border
    bg-[#13131c]
    p-5
    transition-all duration-300
    ${colors.border} ${colors.hoverBorder}
    hover:shadow-xl hover:shadow-black/30 ${colors.glow}
    hover:-translate-y-0.5
    ${tool.comingSoon ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
  `;

  // Non-interactive card for coming soon
  if (tool.comingSoon) {
    return (
      <div className={sharedClasses} aria-disabled="true">
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={tool.href} className={sharedClasses}>
      {cardContent}
    </Link>
  );
}
