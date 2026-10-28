"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LuArrowLeft,
  LuFileText,
  LuClock,
  LuMapPin,
  LuCheck,
  LuX,
  LuRotateCcw,
  LuLoader,
  LuCircleAlert,
  LuFileWarning,
  LuShieldCheck,
} from "react-icons/lu";
import { applications } from "@/lib/data";
import { Application, AppStatus } from "@/lib/types";
import { getPriority } from "@/lib/priority";
import AIAssistant from "@/components/AIAssistant";

// ---------- Inner component (uses useParams) ----------
function ApplicationContent() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [decided, setDecided] = useState<AppStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const found = applications.find((a) => a.id === params.id);
    if (found) setApp(found);
  }, [params.id]);

  const handleDecision = async (
    status: "approved" | "rejected" | "returned",
  ) => {
    setError("");
    if (remarks.trim().length < 5) {
      setError("దయచేసి కనీసం 5 అక్షరాల వ్యాఖ్యలు నమోదు చేయండి.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app?.id,
          status,
          remarks: remarks.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "నిర్ణయం సేవ్ చేయడం విఫలమైంది.");
        return;
      }

      if (app) {
        setApp({ ...app, status });
        setDecided(status);
      }
    } catch {
      setError("నెట్‌వర్క్ లోపం. మళ్లీ ప్రయత్నించండి.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!app) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <LuLoader className="mx-auto h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-3 text-sm text-neutral-500">లోడ్ అవుతోంది…</p>
        </div>
      </div>
    );
  }

  const priority = getPriority(app);
  const missingDocs = app.documents.filter((d) => !d.submitted);

  const decisionLabels: Record<string, { te: string; color: string }> = {
    approved: {
      te: "ఆమోదించబడింది",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    rejected: {
      te: "తిరస్కరించబడింది",
      color: "bg-red-50 text-red-700 border-red-200",
    },
    returned: {
      te: "తిరిగి పంపబడింది",
      color: "bg-accent-50 text-accent-700 border-accent-200",
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-ghost text-sm"
          >
            <LuArrowLeft className="h-4 w-4" />
            డాష్‌బోర్డ్
          </button>
          <div className="flex items-center gap-2">
            <LuShieldCheck className="h-4 w-4 text-primary-700" />
            <span className="text-sm font-mono text-neutral-500">{app.id}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
        {/* Title card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-5 mb-5"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl font-bold text-neutral-800">
                {app.applicantNameTe}
              </h1>
              <p className="text-sm text-neutral-500">{app.applicantName}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`badge ${
                  priority.level === "urgent"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : priority.level === "medium"
                      ? "bg-accent-50 text-accent-700 border border-accent-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                }`}
              >
                {priority.labelTe}
              </span>
              <span className="text-xs text-neutral-500">
                {app.status === "pending"
                  ? "పెండింగ్"
                  : decisionLabels[app.status]?.te}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<LuFileText />} label="రకం" value={app.typeTe} />
            <InfoRow
              icon={<LuMapPin />}
              label="సర్వే నం"
              value={app.surveyNumber}
            />
            <InfoRow icon={<LuMapPin />} label="గ్రామం" value={app.village} />
            <InfoRow
              icon={<LuClock />}
              label="పెండింగ్"
              value={`${app.daysOld} రోజులు`}
            />
          </div>

          <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm">
            <p className="font-semibold text-neutral-700 mb-1">గమనికలు:</p>
            <p className="text-neutral-600">{app.notesTe}</p>
          </div>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="card p-5 mb-5"
        >
          <h2 className="font-bold text-neutral-800 mb-3">పత్రాలు</h2>
          <ul className="space-y-2">
            {app.documents.map((doc, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm"
              >
                <span className="text-neutral-700">{doc.nameTe}</span>
                {doc.submitted ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <LuCheck className="h-3.5 w-3.5" /> సమర్పించారు
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                    <LuFileWarning className="h-3.5 w-3.5" /> మిస్
                  </span>
                )}
              </li>
            ))}
          </ul>
          {missingDocs.length > 0 && (
            <p className="mt-3 flex items-center gap-1 text-xs text-red-600">
              <LuCircleAlert className="h-3.5 w-3.5" />
              {missingDocs.length} పత్రాలు మిస్ అవుతున్నాయి
            </p>
          )}
        </motion.div>

        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-5"
        >
          <AIAssistant app={app} />
        </motion.div>

        {/* Decision panel — plain div (Framer Motion removed to avoid insertBefore error) */}
        <div className="card p-5">
          <h2 className="font-bold text-neutral-800 mb-3">అధికారి నిర్ణయం</h2>

          {decided ? (
            <div
              className={`rounded-lg border p-4 text-sm ${decisionLabels[decided].color}`}
            >
              <p className="font-semibold flex items-center gap-2">
                {decided === "approved" && <LuCheck className="h-4 w-4" />}
                {decided === "rejected" && <LuX className="h-4 w-4" />}
                {decided === "returned" && <LuRotateCcw className="h-4 w-4" />}
                {decisionLabels[decided].te}
              </p>
              <p className="mt-2 text-neutral-700">
                <strong>వ్యాఖ్యలు:</strong> {remarks}
              </p>
            </div>
          ) : (
            <>
              <label
                htmlFor="remarks"
                className="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                వ్యాఖ్యలు (కనీసం 5 అక్షరాలు)
              </label>
              <textarea
                id="remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="input-base mb-3 resize-none"
                placeholder="నిర్ణయానికి కారణం రాయండి…"
                disabled={submitting}
              />

              {error && (
                <p className="mb-3 flex items-center gap-1 rounded-lg bg-red-50 p-2 text-sm text-red-700">
                  <LuCircleAlert className="h-4 w-4" />
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  onClick={() => handleDecision("approved")}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <LuLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <LuCheck className="h-4 w-4" />
                  )}
                  ఆమోదించు
                </button>
                <button
                  onClick={() => handleDecision("returned")}
                  disabled={submitting}
                  className="btn-accent"
                >
                  {submitting ? (
                    <LuLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <LuRotateCcw className="h-4 w-4" />
                  )}
                  తిరిగి పంపు
                </button>
                <button
                  onClick={() => handleDecision("rejected")}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <LuLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <LuX className="h-4 w-4" />
                  )}
                  తిరస్కరించు
                </button>
              </div>

              <p className="mt-3 flex items-center gap-1 text-xs text-neutral-500">
                <LuShieldCheck className="h-3.5 w-3.5" />
                AI సూచన సహాయకం మాత్రమే. తుది నిర్ణయం మీదే.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-neutral-400">{icon}</span>
      <span className="text-neutral-500">{label}:</span>
      <span className="font-medium text-neutral-800">{value}</span>
    </div>
  );
}

// ---------- Outer default export with Suspense ----------
export default function ApplicationDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <div className="text-center">
            <LuLoader className="mx-auto h-8 w-8 animate-spin text-primary-600" />
            <p className="mt-3 text-sm text-neutral-500">లోడ్ అవుతోంది…</p>
          </div>
        </div>
      }
    >
      <ApplicationContent />
    </Suspense>
  );
}
