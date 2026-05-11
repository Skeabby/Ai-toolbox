// ─────────────────────────────────────────────────────────────
//  components/layout/Sidebar.tsx
//  Fixed left sidebar with:
//    - Logo + app name
//    - Primary nav (tools)
//    - Secondary nav (settings / profile)
//    - Streak counter
//    - Mobile: slide-in drawer triggered by hamburger in Navbar
//
//  Usage:
//    // In (dashboard)/layout.tsx
//    <Sidebar />
//    <main>{children}</main>
// ─────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Layers,
  StickyNote,
  CalendarDays,
  Timer,
  MessageSquare,
  Settings,
  LogOut,
  Flame,
  BookOpen,
} from "lucide-react";

// ── Nav item type ─────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

// ── Primary navigation ────────────────────────────────────────

const primaryNav: NavItem[] = [
  { label: "Dashboard",     href: "/dashboard",       icon: LayoutDashboard },
  { label: "Notes",         href: "/notes",           icon: StickyNote },
  { label: "PDF Summarizer",href: "/pdf-summarizer",  icon: FileText },
  { label: "Quiz Generator",href: "/quiz",            icon: HelpCircle },
  { label: "Flashcards",    href: "/flashcards",      icon: Layers },
  { label: "Study Planner", href: "/study-planner",   icon: CalendarDays },
  { label: "Productivity",  href: "/productivity",    icon: Timer },
  { label: "Debate Helper", href: "/debate",          icon: MessageSquare, badge: "New" },
];

const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

// ── Single nav item ───────────────────────────────────────────

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`
        group flex items-center gap-3
        rounded-xl px-3 py-2.5
        text-[13px] font-medium
        transition-all duration-150
        outline-none focus-visible:ring-2 focus-visible:ring-[#6c63a8]
        ${
          isActive
            ? "bg-[#2a2638] text-[#c4bbf0] border border-[#4a4470]"
            : "text-[#5a5a7a] border border-transparent hover:text-[#a09ad0] hover:bg-[#1a1a26]"
        }
      `}
    >
      {/* Active bar */}
      <span
        className={`
          absolute -left-px h-5 w-0.5 rounded-full
          bg-[#9d94d8]
          transition-opacity duration-150
          ${isActive ? "opacity-100" : "opacity-0"}
        `}
      />

      <Icon
        className={`
          h-4 w-4 shrink-0
          transition-colors duration-150
          ${isActive ? "text-[#9d94d8]" : "text-[#4a4a6a] group-hover:text-[#7070a0]"}
        `}
      />
      <span className="flex-1 truncate">{item.label}</span>

      {/* Optional badge */}
      {item.badge && (
        <span
          className="
            rounded-full bg-emerald-500/15 px-1.5 py-0.5
            text-[10px] font-semibold text-emerald-400
          "
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ── Section label ─────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-5 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a3a5a]">
      {children}
    </p>
  );
}

// ── Main sidebar ──────────────────────────────────────────────

interface SidebarProps {
  /** Passed from server component — user name + study streak */
  userName?: string;
  userEmail?: string;
  studyStreak?: number;
  onSignOut?: () => void;
}

export default function Sidebar({
  userName = "Student",
  userEmail = "",
  studyStreak = 0,
  onSignOut,
}: SidebarProps) {
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="
          relative hidden lg:flex
          flex-col
          w-60 shrink-0
          h-screen sticky top-0
          border-r border-[#1e1e2e]
          bg-[#0d0d14]
          overflow-y-auto
          py-5 px-3
        "
        aria-label="Main navigation"
      >
        <SidebarContents
          userName={userName}
          userEmail={userEmail}
          studyStreak={studyStreak}
          onSignOut={onSignOut}
        />
      </aside>
    </>
  );
}

// ── Inner content (shared between desktop + mobile drawer) ────

export function SidebarContents({
  userName,
  userEmail,
  studyStreak = 0,
  onSignOut,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      {/* ── Logo ── */}
      <Link
        href="/dashboard"
        className="
          mb-6 flex items-center gap-2.5 px-1
          outline-none focus-visible:ring-2 focus-visible:ring-[#6c63a8] rounded-lg
        "
      >
        <div
          className="
            flex h-8 w-8 items-center justify-center
            rounded-lg bg-[#2a2638]
            border border-[#4a4470]
          "
        >
          <BookOpen className="h-4 w-4 text-[#9d94d8]" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-[#e8e6f0]">
          AI Toolkit
        </span>
      </Link>

      {/* ── Streak pill ── */}
      {studyStreak > 0 && (
        <div
          className="
            mb-4 flex items-center gap-2
            rounded-xl border border-[#2a1e1a]
            bg-[#1a1510] px-3 py-2
          "
        >
          <Flame className="h-4 w-4 text-orange-400" aria-hidden />
          <span className="text-[13px] font-medium text-orange-300">
            {studyStreak}-day streak
          </span>
        </div>
      )}

      {/* ── Primary nav ── */}
      <nav className="flex-1 space-y-0.5">
        <SectionLabel>Tools</SectionLabel>
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* ── Bottom section ── */}
      <div className="mt-4 border-t border-[#1e1e2e] pt-4 space-y-0.5">
        <SectionLabel>Account</SectionLabel>
        {secondaryNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="
            flex w-full items-center gap-3
            rounded-xl px-3 py-2.5
            text-[13px] font-medium text-[#5a5a7a]
            border border-transparent
            transition-all duration-150
            hover:text-rose-400 hover:bg-[#1e1418] hover:border-rose-900/40
          "
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>

        {/* User avatar block */}
        <div
          className="
            mt-3 flex items-center gap-3
            rounded-xl border border-[#1e1e2e]
            bg-[#13131c] px-3 py-2.5
          "
        >
          {/* Avatar initials */}
          <div
            className="
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-full bg-[#2a2638]
              text-[12px] font-semibold text-[#9d94d8]
            "
            aria-hidden="true"
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-[#c4bbf0]">
              {userName}
            </p>
            {userEmail && (
              <p className="truncate text-[11px] text-[#4a4a6a]">{userEmail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
