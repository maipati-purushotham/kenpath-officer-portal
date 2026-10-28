"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuSparkles,
  LuLoader,
  LuCircleAlert,
  LuFileWarning,
  LuLightbulb,
  LuShieldAlert,
  LuRefreshCw,
} from "react-icons/lu";
import { Application, AIResult } from "@/lib/types";

const DECISION_LABELS: Record<string, { labelTe: string; className: string }> =
  {
    approve: {
      labelTe: "ఆమోదించడం మంచిది",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    reject: {
      labelTe: "తిరస్కరించడం మంచిది",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    return: {
      labelTe: "తిరిగి పంపడం మంచిది",
      className: "bg-accent-50 text-accent-700 border-accent-200",
    },
  };

export default function AIAssistant({ app }: { app: Application }) {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAI = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: app.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "AI విశ్లేషణ విఫలమైంది");
        return;
      }

      setResult(data);
    } catch {
      setError("నెట్‌వర్క్ లోపం. మళ్లీ ప్రయత్నించండి.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5 border-l-4 border-l-accent-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-100">
            <LuSparkles className="h-5 w-5 text-accent-700" />
          </div>
          <div>
            <h2 className="font-bold text-neutral-800">AI సహాయం</h2>
            <p className="text-xs text-neutral-500">
              సారాంశం, మిస్ అయిన పత్రాలు, సూచన
            </p>
          </div>
        </div>

        <button
          onClick={runAI}
          disabled={loading}
          className={result ? "btn-ghost text-sm" : "btn-accent text-sm"}
        >
          {loading ? (
            <>
              <LuLoader className="h-4 w-4 animate-spin" />
              విశ్లేషిస్తోంది…
            </>
          ) : result ? (
            <>
              <LuRefreshCw className="h-4 w-4" />
              మళ్లీ విశ్లేషించు
            </>
          ) : (
            <>
              <LuSparkles className="h-4 w-4" />
              విశ్లేషించు
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            <LuCircleAlert className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {!result && !loading && !error && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600"
          >
            <p>
              ఈ దరఖాస్తుపై AI విశ్లేషణ పొందడానికి{" "}
              <strong className="text-accent-700">"విశ్లేషించు"</strong>{" "}
              నొక్కండి. AI సారాంశం, మిస్ అయిన పత్రాలు, అసమానతలు మరియు సూచనను
              అందిస్తుంది.
            </p>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-3 rounded bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:1000px_100%] animate-shimmer"
                style={{ width: `${80 - i * 10}%` }}
              />
            ))}
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-sm"
          >
            {/* Summary */}
            <div>
              <p className="mb-1 font-semibold text-neutral-800">📋 సారాంశం</p>
              <p className="text-neutral-600 leading-relaxed">
                {result.summaryTe}
              </p>
            </div>

            {/* Missing documents */}
            {result.missingDocuments.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1 font-semibold text-red-600">
                  <LuFileWarning className="h-4 w-4" />
                  మిస్ అయిన పత్రాలు
                </p>
                <ul className="space-y-1 text-neutral-600">
                  {result.missingDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inconsistencies */}
            {result.inconsistencies.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1 font-semibold text-accent-700">
                  <LuCircleAlert className="h-4 w-4" />
                  అసమానతలు
                </p>
                <ul className="space-y-1 text-neutral-600">
                  {result.inconsistencies.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested decision */}
            <div className="rounded-lg border bg-neutral-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-1 font-semibold text-neutral-800">
                  <LuLightbulb className="h-4 w-4" />
                  సూచన
                </p>
                <span
                  className={`badge ${
                    DECISION_LABELS[result.suggestedDecision].className
                  }`}
                >
                  {DECISION_LABELS[result.suggestedDecision].labelTe}
                </span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                {result.reasonsTe}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
                <span>విశ్వాసం:</span>
                <span className="font-semibold capitalize">
                  {result.confidence === "high"
                    ? "అధికం"
                    : result.confidence === "medium"
                      ? "మధ్యస్థం"
                      : "తక్కువ"}
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 rounded-lg bg-accent-50 p-3 text-xs text-accent-800">
              <LuShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                ఇది సూచన మాత్రమే. తుది నిర్ణయం అధికారి మాత్రమే తీసుకోవాలి.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
