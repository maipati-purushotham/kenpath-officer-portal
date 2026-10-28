"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuFileText,
  LuCircleAlert,
  LuFileWarning,
  LuLogOut,
  LuShieldCheck,
  LuLayoutDashboard,
  LuLoader,
  LuRefreshCw,
  LuSearch,
  LuFilter,
  LuX,
} from "react-icons/lu";
import { applications } from "@/lib/data";
import { sortByPriority, getPriority } from "@/lib/priority";
import AppCard from "@/components/AppCard";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "urgent" | "missing">(
    "all",
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // 1. Sort by priority first
  const sortedApps = useMemo(() => sortByPriority(applications), []);

  // 2. Filter & Search logic
  const filteredApps = useMemo(() => {
    return sortedApps.filter((app) => {
      // Filter logic
      if (filterType === "urgent" && getPriority(app).level !== "urgent")
        return false;
      if (filterType === "missing" && !app.documents.some((d) => !d.submitted))
        return false;

      // Search logic (matches ID, Name, Survey No, Village)
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      return (
        app.applicantNameTe.toLowerCase().includes(query) ||
        app.applicantName.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query) ||
        app.surveyNumber.toLowerCase().includes(query) ||
        app.village.toLowerCase().includes(query)
      );
    });
  }, [sortedApps, searchQuery, filterType]);

  const stats = useMemo(() => {
    const urgent = applications.filter(
      (a) => getPriority(a).level === "urgent",
    ).length;
    const withMissingDocs = applications.filter((a) =>
      a.documents.some((d) => !d.submitted),
    ).length;
    return {
      total: applications.length,
      urgent,
      withMissingDocs,
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 font-sans">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700 shadow-sm">
              <LuShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-900 md:text-base leading-tight">
                భూ రికార్డుల అధికారి పోర్టల్
              </h1>
              <p className="text-[11px] font-medium text-neutral-500 leading-tight">
                Revenue Officer Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200/60">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              ఆన్‌లైన్
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-50"
            >
              {loggingOut ? (
                <LuLoader className="h-4 w-4 animate-spin" />
              ) : (
                <LuLogOut className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">లాగౌట్</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              పెండింగ్ దరఖాస్తులు
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              ప్రాధాన్యత ప్రకారం అమర్చబడ్డాయి (అత్యవసరం మొదట)
            </p>
          </motion.div>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-95"
          >
            <LuRefreshCw className="h-4 w-4" />
            రిఫ్రెష్
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<LuFileText className="h-5 w-5" />}
            label="మొత్తం పెండింగ్"
            value={stats.total}
            color="primary"
            delay={0.05}
          />
          <StatCard
            icon={<LuCircleAlert className="h-5 w-5" />}
            label="అత్యవసరం"
            value={stats.urgent}
            color="red"
            delay={0.1}
          />
          <StatCard
            icon={<LuFileWarning className="h-5 w-5" />}
            label="పత్రాలు మిస్"
            value={stats.withMissingDocs}
            color="accent"
            delay={0.15}
          />
        </div>

        {/* ================= SEARCH & FILTER BAR ================= */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="పేరు, ID, సర్వే నం లేదా గ్రామం ద్వారా వెతకండి..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-none bg-neutral-100 py-2.5 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <LuX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
            <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 mr-2 shrink-0">
              <LuFilter className="h-4 w-4" />
              ఫిల్టర్:
            </div>

            <FilterBtn
              active={filterType === "all"}
              onClick={() => setFilterType("all")}
              label="అన్నీ"
              count={sortedApps.length}
            />
            <FilterBtn
              active={filterType === "urgent"}
              onClick={() => setFilterType("urgent")}
              label="అత్యవసరం"
              count={stats.urgent}
            />
            <FilterBtn
              active={filterType === "missing"}
              onClick={() => setFilterType("missing")}
              label="పత్రాలు మిస్"
              count={stats.withMissingDocs}
            />
          </div>
        </div>

        {/* Application List */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredApps.length === 0 ? (
          <EmptyState
            isSearch={searchQuery.length > 0 || filterType !== "all"}
            clearAction={() => {
              setSearchQuery("");
              setFilterType("all");
            }}
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredApps.map((app, index) => (
                <AppCard key={app.id} app={app} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

// ---------- SUB COMPONENTS ----------

function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "red" | "accent";
  delay: number;
}) {
  const colorMap = {
    primary: "bg-primary-50 text-primary-700 border-primary-100",
    red: "bg-red-50 text-red-600 border-red-100",
    accent: "bg-accent-50 text-accent-700 border-accent-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
      </div>
    </motion.div>
  );
}

function FilterBtn({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary-50 text-primary-700 border border-primary-200"
          : "bg-white text-neutral-600 border border-transparent hover:bg-neutral-50"
      }`}
    >
      {label}
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-primary-200 text-primary-800"
            : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <div className="animate-pulse flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-5 w-2/3 sm:w-1/3 rounded bg-neutral-200" />
              <div className="h-4 w-1/2 rounded bg-neutral-100" />
              <div className="flex gap-4">
                <div className="h-4 w-24 rounded bg-neutral-100" />
                <div className="h-4 w-24 rounded bg-neutral-100" />
              </div>
            </div>
            <div className="h-8 w-24 rounded-full bg-neutral-200 self-start" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  isSearch,
  clearAction,
}: {
  isSearch: boolean;
  clearAction: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-neutral-200 bg-white py-16 text-center shadow-sm"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
        {isSearch ? (
          <LuSearch className="h-8 w-8 text-neutral-400" />
        ) : (
          <LuLayoutDashboard className="h-8 w-8 text-neutral-400" />
        )}
      </div>
      <h3 className="text-lg font-bold text-neutral-900">
        {isSearch ? "ఫలితాలు కనుగొనబడలేదు" : "పెండింగ్ దరఖాస్తులు లేవు"}
      </h3>
      <p className="mt-1 text-sm text-neutral-500 mb-4">
        {isSearch
          ? "మీరు వెతికిన పదానికి సరిపోయే దరఖాస్తులు లేవు."
          : "అన్ని దరఖాస్తులు పరిష్కరించబడ్డాయి"}
      </p>
      {isSearch && (
        <button
          onClick={clearAction}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          <LuRefreshCw className="h-3.5 w-3.5" /> ఫిల్టర్లను క్లియర్ చేయండి
        </button>
      )}
    </motion.div>
  );
}
