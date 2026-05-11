// ─────────────────────────────────────────────────────────────
//  components/ui/SearchBar.tsx
//  Controlled search input with clear button and ⌘K hint.
//
//  Usage:
//    <SearchBar value={query} onChange={setQuery} />
//
//  Optional wiring for ⌘K global shortcut: see useEffect below.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Wire up ⌘K / Ctrl+K to focus this input */
  enableShortcut?: boolean;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search tools…",
  enableShortcut = true,
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K focuses the search bar from anywhere
  useEffect(() => {
    if (!enableShortcut) return;

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enableShortcut]);

  return (
    <div className={`relative group ${className}`}>
      {/* Search icon */}
      <Search
        className="
          absolute left-3.5 top-1/2 -translate-y-1/2
          h-4 w-4 text-[#5a5a7a]
          transition-colors duration-150
          group-focus-within:text-[#a09ad0]
        "
        aria-hidden="true"
      />

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        aria-label="Search tools"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-10
          pl-10 pr-20
          rounded-xl
          bg-[#16161f]
          border border-[#2a2a3d]
          text-[#e8e6f0] placeholder-[#4a4a6a]
          text-sm
          outline-none
          transition-all duration-200
          focus:border-[#6c63a8] focus:bg-[#1a1a28]
          focus:ring-2 focus:ring-[#6c63a8]/20
          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {/* Right side: clear button OR ⌘K hint */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value ? (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="
              p-0.5 rounded-md
              text-[#5a5a7a] hover:text-[#e8e6f0]
              hover:bg-[#2a2a3d]
              transition-colors duration-150
            "
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd
            className="
              hidden sm:flex items-center gap-0.5
              px-1.5 py-0.5
              rounded-md
              border border-[#2a2a3d]
              bg-[#1a1a26]
              text-[#4a4a6a] text-[10px]
              font-mono
              pointer-events-none
            "
          >
            <span className="text-[11px]">⌘</span>K
          </kbd>
        )}
      </div>
    </div>
  );
}
