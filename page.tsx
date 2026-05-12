// ─────────────────────────────────────────────────────────────────────────────
//  app/(dashboard)/prompt-improver/page.tsx
//
//  The Prompt Improver feature page.
//  This is a Client Component so it can manage form state, loading, and copy.
//
//  File lives at:  app/(dashboard)/prompt-improver/page.tsx
//  Accessible at:  /prompt-improver  (inside the authenticated dashboard)
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sparkles, Copy, Check, RefreshCw, ChevronRight,
  AlertCircle, Wand2, ArrowRight, Lightbulb, Tag,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ImproveResult {
  improved: string;
  changes:  string[];
  category: string;
  tone:     string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_CHARS = 2000;

const EXAMPLES = [
  "write me a story",
  "explain machine learning",
  "help fix my code",
  "make a marketing email for my app",
  "summarise this research paper",
];

const CATEGORY_COLORS: Record<string, string> = {
  creative:       "text-pink-400   bg-pink-500/10   border-pink-500/20",
  technical:      "text-blue-400   bg-blue-500/10   border-blue-500/20",
  analytical:     "text-amber-400  bg-amber-500/10  border-amber-500/20",
  instructional:  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  conversational: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  research:       "text-cyan-400   bg-cyan-500/10   border-cyan-500/20",
};

const TONE_LABELS: Record<string, string> = {
  formal:   "Formal",
  neutral:  "Neutral",
  casual:   "Casual",
};

// ── Sub-components ────────────────────────────────────────────────────────────

/** Skeleton shown while waiting for the AI response */
function ResultSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Loading result…" aria-live="polite">
      <div className="h-4 bg-[#2a2a3d] rounded-md w-full"    />
      <div className="h-4 bg-[#2a2a3d] rounded-md w-11/12"   />
      <div className="h-4 bg-[#2a2a3d] rounded-md w-4/5"     />
      <div className="h-4 bg-[#22223a] rounded-md w-full mt-2" />
      <div className="h-4 bg-[#22223a] rounded-md w-3/4"     />
      <div className="mt-5 h-3 bg-[#2a2a3d] rounded-full w-1/3" />
      <div className="h-3 bg-[#2a2a3d] rounded-full w-1/2"   />
      <div className="h-3 bg-[#2a2a3d] rounded-full w-2/5"   />
    </div>
  );
}

/** "What changed" list shown below the improved prompt */
function ChangesList({ changes }: { changes: string[] }) {
  return (
    <ul className="mt-5 space-y-2" aria-label="Improvements made">
      {changes.map((change, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#7070a0]">
          <span
            className="
              mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center
              rounded-full bg-[#2a2638] text-[#9d94d8]
              text-[10px] font-semibold
            "
          >
            {i + 1}
          </span>
          {change}
        </li>
      ))}
    </ul>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PromptImproverPage() {
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState<ImproveResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef   = useRef<HTMLDivElement>(null);

  const charsLeft = MAX_CHARS - input.length;
  const tooShort  = input.trim().length < 10;
  const tooLong   = input.length > MAX_CHARS;

  // ── Improve handler ─────────────────────────────────────────────────────────

  const handleImprove = useCallback(async () => {
    if (tooShort || tooLong || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/improve-prompt", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ prompt: input.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setResult(data as ImproveResult);

      // Scroll result into view on mobile
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, tooShort, tooLong]);

  // ── Keyboard shortcut: ⌘ + Enter ───────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleImprove();
    }
  };

  // ── Copy handler ────────────────────────────────────────────────────────────

  const handleCopy = () => {
    if (!result?.improved) return;
    navigator.clipboard.writeText(result.improved).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  // ── Regenerate ──────────────────────────────────────────────────────────────

  const handleRegenerate = () => {
    setResult(null);
    handleImprove();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0d0d14] px-4 py-8 sm:px-6 lg:px-10">

      {/* ── Page header ── */}
      <div className="mb-10 max-w-2xl">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2a2638] border border-[#4a4470]">
            <Wand2 className="h-4 w-4 text-[#9d94d8]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#e8e6f0]">
            Prompt Improver
          </h1>
        </div>
        <p className="text-[14px] leading-relaxed text-[#5a5a7a]">
          Paste any rough prompt and AI will rewrite it to be specific, clear,
          and highly effective — with a breakdown of exactly what changed.
        </p>
      </div>

      {/* ── Two-column layout (stacked on mobile) ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">

        {/* ══ LEFT: Input panel ══ */}
        <div className="flex flex-col gap-4">

          {/* Example prompts */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => { setInput(ex); textareaRef.current?.focus(); }}
                className="
                  flex items-center gap-1.5
                  rounded-full border border-[#2a2a3d]
                  bg-[#13131c] px-3 py-1.5
                  text-[11px] text-[#5a5a7a]
                  transition-all duration-150
                  hover:border-[#4a4470] hover:text-[#a09ad0]
                "
              >
                <Lightbulb className="h-3 w-3" aria-hidden />
                {ex}
              </button>
            ))}
          </div>

          {/* Textarea card */}
          <div
            className={`
              rounded-2xl border bg-[#111119]
              transition-colors duration-200
              ${tooLong
                ? "border-rose-500/50"
                : error
                ? "border-rose-500/30"
                : "border-[#1e1e2c] focus-within:border-[#4a4470]"}
            `}
          >
            <div className="p-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); setResult(null); }}
                onKeyDown={handleKeyDown}
                placeholder={"e.g. write me a story about space\n\nTip: even one sentence works — the vaguer the better to see the difference."}
                aria-label="Your prompt to improve"
                rows={10}
                className="
                  w-full resize-none rounded-xl
                  bg-transparent px-4 py-3.5
                  text-[14px] leading-relaxed
                  text-[#d8d4f0] placeholder-[#353550]
                  outline-none
                "
              />
            </div>

            {/* Textarea footer */}
            <div className="flex items-center justify-between border-t border-[#1a1a28] px-4 py-2.5">
              <span
                className={`text-[11px] tabular-nums ${
                  tooLong
                    ? "text-rose-400 font-semibold"
                    : charsLeft < 200
                    ? "text-amber-400"
                    : "text-[#3a3a5a]"
                }`}
              >
                {input.length} / {MAX_CHARS}
              </span>
              <span className="text-[11px] text-[#2e2e48]">⌘ Enter to improve</span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="
                flex items-start gap-3
                rounded-xl border border-rose-500/25
                bg-rose-500/8 px-4 py-3
              "
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <p className="text-[13px] text-rose-300 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Improve button */}
          <button
            onClick={handleImprove}
            disabled={tooShort || tooLong || loading}
            aria-busy={loading}
            className="
              group relative flex w-full items-center justify-center gap-2.5
              overflow-hidden rounded-xl
              px-6 py-3.5
              text-[14px] font-semibold
              transition-all duration-200
              disabled:cursor-not-allowed disabled:opacity-40
              bg-[#2a2638] border border-[#4a4470]
              text-[#c4bbf0]
              hover:enabled:bg-[#342d48] hover:enabled:border-[#6c63a8]
              hover:enabled:shadow-lg hover:enabled:shadow-[#6c63a8]/10
              active:enabled:scale-[.98]
            "
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Improving…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Improve Prompt
                <ChevronRight className="
                  h-4 w-4 text-[#6c63a8]
                  transition-transform duration-150
                  group-hover:translate-x-0.5
                " />
              </>
            )}
            {/* Shimmer on hover */}
            <span
              className="
                pointer-events-none absolute inset-0
                -translate-x-full
                bg-gradient-to-r from-transparent via-white/[.04] to-transparent
                group-hover:animate-[shimmer_.8s_ease-in-out]
              "
            />
          </button>
        </div>

        {/* ══ RIGHT: Output panel ══ */}
        <div ref={resultRef} className="rounded-2xl border border-[#1e1e2c] bg-[#111119]">

          {/* Output header */}
          <div className="flex items-center justify-between border-b border-[#1a1a28] px-5 py-3.5">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#5a5a7a]">
              <ArrowRight className="h-3.5 w-3.5" />
              Improved prompt
            </div>

            {result && (
              <div className="flex items-center gap-2">
                {/* Regenerate */}
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  aria-label="Regenerate"
                  className="
                    flex items-center gap-1.5 rounded-lg
                    border border-[#2a2a3d] px-2.5 py-1.5
                    text-[11px] text-[#5a5a7a]
                    transition-all duration-150
                    hover:border-[#4a4470] hover:text-[#a09ad0]
                    disabled:opacity-40
                  "
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                  Retry
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  aria-label={copied ? "Copied!" : "Copy improved prompt"}
                  className={`
                    flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
                    text-[11px] font-medium
                    border transition-all duration-150
                    ${copied
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-[#2a2a3d] text-[#5a5a7a] hover:border-[#4a4470] hover:text-[#a09ad0]"
                    }
                  `}
                >
                  {copied
                    ? <><Check className="h-3 w-3" />Copied</>
                    : <><Copy className="h-3 w-3" />Copy</>
                  }
                </button>
              </div>
            )}
          </div>

          {/* Output body */}
          <div className="min-h-[280px] p-5">
            {loading ? (
              <ResultSkeleton />
            ) : result ? (
              <>
                {/* Improved text */}
                <p className="text-[14px] leading-relaxed text-[#d8d4f0] whitespace-pre-wrap">
                  {result.improved}
                </p>

                {/* Divider */}
                <div className="my-5 border-t border-[#1a1a28]" />

                {/* Metadata row */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {result.category && (
                    <span
                      className={`
                        flex items-center gap-1.5
                        rounded-full border px-2.5 py-1
                        text-[11px] font-medium capitalize
                        ${CATEGORY_COLORS[result.category] ?? "text-[#7070a0] bg-[#1a1a26] border-[#2a2a3d]"}
                      `}
                    >
                      <Tag className="h-3 w-3" aria-hidden />
                      {result.category}
                    </span>
                  )}
                  {result.tone && (
                    <span className="rounded-full border border-[#2a2a3d] bg-[#1a1a26] px-2.5 py-1 text-[11px] text-[#5a5a7a]">
                      {TONE_LABELS[result.tone] ?? result.tone} tone
                    </span>
                  )}
                </div>

                {/* What changed */}
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#3a3a5a]">
                  What changed
                </p>
                <ChangesList changes={result.changes} />
              </>
            ) : (
              /* Empty state */
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a1a26] border border-[#2a2a3d]">
                  <Wand2 className="h-5 w-5 text-[#3a3a5a]" />
                </div>
                <p className="text-[14px] font-medium text-[#3a3a5a]">
                  Your improved prompt appears here
                </p>
                <p className="mt-1.5 text-[12px] text-[#2a2a4a]">
                  Type or paste a prompt on the left, then click Improve
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
