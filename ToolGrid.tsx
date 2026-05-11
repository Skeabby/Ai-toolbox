// ─────────────────────────────────────────────────────────────
//  components/dashboard/ToolGrid.tsx
//  Renders the full tool-browsing experience:
//    - Category filter tabs
//    - Search bar (with URL-sync via query params)
//    - Responsive card grid
//    - Loading skeleton state
//    - Empty state with clear-filter CTA
//
//  Usage (server component wrapper passes initial data):
//    <ToolGrid />
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useMemo, useTransition } from "react";
import { Sparkles } from "lucide-react";
import ToolCard from "@/components/ui/ToolCard";
import SearchBar from "@/components/ui/SearchBar";
import {
  tools,
  type ToolCategory,
  categoryLabels,
} from "@/lib/data/tools";

// ── Category tab order ────────────────────────────────────────
const CATEGORIES: ToolCategory[] = [
  "all",
  "ai",
  "study",
  "productivity",
  "notes",
];

// ── Empty state ───────────────────────────────────────────────

function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div
      className="
        col-span-full
        flex flex-col items-center justify-center
        py-20 text-center
      "
    >
      <div
        className="
          mb-4
          flex h-14 w-14 items-center justify-center
          rounded-2xl bg-[#1e1e2e] border border-[#2a2a3d]
        "
      >
        <Sparkles className="h-6 w-6 text-[#4a4a6a]" />
      </div>
      <p className="mb-1 text-[15px] font-medium text-[#e8e6f0]">
        No tools found
      </p>
      <p className="mb-5 text-sm text-[#5a5a7a]">
        Nothing matched{" "}
        <span className="text-[#9d94d8]">"{query}"</span>
      </p>
      <button
        onClick={onClear}
        className="
          rounded-xl
          border border-[#2a2a3d]
          bg-[#1a1a26]
          px-4 py-2
          text-sm text-[#a09ad0]
          transition-all duration-150
          hover:border-[#4a4470] hover:bg-[#1e1e2e]
        "
      >
        Clear search
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface ToolGridProps {
  /** Show skeleton cards instead of real content */
  loading?: boolean;
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number;
}

export default function ToolGrid({
  loading = false,
  skeletonCount = 8,
}: ToolGridProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [, startTransition] = useTransition();

  // ── Filtering ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = tools;

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Search filter
    const q = query.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [query, activeCategory]);

  const handleCategoryChange = (cat: ToolCategory) => {
    startTransition(() => {
      setActiveCategory(cat);
    });
  };

  const handleClear = () => {
    setQuery("");
    setActiveCategory("all");
  };

  return (
    <div className="space-y-6">
      {/* ── Top bar: search + count ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          className="w-full sm:max-w-xs"
        />
        {!loading && (
          <p className="shrink-0 text-[13px] text-[#5a5a7a]">
            {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "all" || query
              ? " found"
              : " available"}
          </p>
        )}
      </div>

      {/* ── Category tabs ── */}
      <div
        className="
          flex gap-1
          overflow-x-auto pb-1
          scrollbar-none
        "
        role="tablist"
        aria-label="Filter tools by category"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleCategoryChange(cat)}
              className={`
                shrink-0
                rounded-xl px-3.5 py-2
                text-[13px] font-medium
                transition-all duration-150
                outline-none focus-visible:ring-2 focus-visible:ring-[#6c63a8]
                ${
                  isActive
                    ? "bg-[#2a2638] text-[#c4bbf0] border border-[#4a4470]"
                    : "text-[#5a5a7a] hover:text-[#a09ad0] hover:bg-[#1a1a26] border border-transparent"
                }
              `}
            >
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* ── Grid ── */}
      <div
        className="
          grid gap-3
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {loading ? (
          // Skeleton cards
          Array.from({ length: skeletonCount }).map((_, i) => (
            <ToolCard
              key={i}
              tool={tools[0]} // shape-only, overridden by loading prop
              loading
            />
          ))
        ) : filtered.length === 0 ? (
          <EmptyState query={query} onClear={handleClear} />
        ) : (
          filtered.map((tool) => <ToolCard key={tool.id} tool={tool} />)
        )}
      </div>
    </div>
  );
}
