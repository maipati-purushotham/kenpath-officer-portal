"use client";

import { motion } from "framer-motion";
import {
  LuFileText,
  LuClock,
  LuCircleAlert,
  LuChevronRight,
  LuFileWarning,
} from "react-icons/lu";
import Link from "next/link";
import { Application } from "@/lib/types";
import { getPriority } from "@/lib/priority";

const PRIORITY_STYLES = {
  urgent: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    border: "border-l-4 border-l-red-500",
    icon: LuCircleAlert,
  },
  medium: {
    badge: "bg-accent-50 text-accent-700 border border-accent-200",
    border: "border-l-4 border-l-accent-500",
    icon: LuClock,
  },
  normal: {
    badge: "bg-neutral-100 text-neutral-600 border border-neutral-200",
    border: "border-l-4 border-l-neutral-300",
    icon: LuFileText,
  },
} as const;

export default function AppCard({
  app,
  index,
}: {
  app: Application;
  index: number;
}) {
  const priority = getPriority(app);
  const styles = PRIORITY_STYLES[priority.level];
  const PriorityIcon = styles.icon;
  const missingCount = app.documents.filter((d) => !d.submitted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Link
        href={`/application/${app.id}`}
        className={`card block p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${styles.border}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-neutral-800 truncate">
                {app.applicantNameTe}
              </h3>
              <span className="text-xs text-neutral-400 font-mono">
                {app.id}
              </span>
            </div>

            <p className="text-sm text-neutral-600 mb-2">
              {app.typeTe} · సర్వే నం: {app.surveyNumber} · {app.village}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-neutral-500">
                <LuClock className="h-3.5 w-3.5" />
                {app.daysOld} రోజులు పెండింగ్
              </span>

              {missingCount > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <LuFileWarning className="h-3.5 w-3.5" />
                  {missingCount} పత్రాలు మిస్
                </span>
              )}

              <span className="text-neutral-400">
                సమర్పించిన రోజు: {app.submittedDate}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`badge ${styles.badge} flex items-center gap-1`}>
              <PriorityIcon className="h-3 w-3" />
              {priority.labelTe}
            </span>
            <LuChevronRight className="h-4 w-4 text-neutral-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
