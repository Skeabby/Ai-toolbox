// ─────────────────────────────────────────────────────────────
//  app/(dashboard)/dashboard/page.tsx
//  Main dashboard page — shows greeting, quick stats, and
//  the full ToolGrid. This is a Server Component; client
//  interactivity lives inside ToolGrid.
// ─────────────────────────────────────────────────────────────
import { createServerClient } from "@/lib/supabase/server";
import ToolGrid from "@/components/dashboard/ToolGrid";
import { Zap, BookOpen, CheckSquare, Clock } from "lucide-react";

// ── Quick-stat card ───────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div
      className="
        rounded-2xl border border-[#2a2a3d]
        bg-[#13131c]
        px-5 py-4
        flex items-center gap-4
      "
    >
      <div
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl ${accent}
        `}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[22px] font-bold leading-none text-[#e8e6f0]">
          {value}
        </p>
        <p className="mt-0.5 text-[12px] text-[#5a5a7a]">{label}</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Fetch user session server-side (zero client waterfall)
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? "Student";

  // In a real app, fetch these from the DB:
  const stats = {
    studyMinutes: 124,
    tasksCompleted: 7,
    quizzesTaken: 3,
    streak: 5,
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] px-6 py-8 lg:px-10">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold tracking-tight text-[#e8e6f0]">
          Good morning, {firstName} 👋
        </h1>
        <p className="mt-1 text-[14px] text-[#5a5a7a]">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* ── Quick stats ── */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Minutes studied today"
          value={stats.studyMinutes}
          icon={Clock}
          accent="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          label="Tasks completed"
          value={stats.tasksCompleted}
          icon={CheckSquare}
          accent="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          label="Quizzes taken"
          value={stats.quizzesTaken}
          icon={BookOpen}
          accent="bg-violet-500/10 text-violet-400"
        />
        <StatCard
          label="Day streak 🔥"
          value={stats.streak}
          icon={Zap}
          accent="bg-orange-500/10 text-orange-400"
        />
      </div>

      {/* ── Divider ── */}
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-[16px] font-semibold text-[#c4bbf0]">
          All Tools
        </h2>
        <div className="flex-1 border-t border-[#1e1e2e]" />
      </div>

      {/* ── Tool grid (client component) ── */}
      <ToolGrid />
    </div>
  );
}
