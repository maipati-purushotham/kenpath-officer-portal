import { Application } from "./types";

export type PriorityLevel = "urgent" | "medium" | "normal";

export interface Priority {
  level: PriorityLevel;
  labelTe: string;
  reasonTe: string;
}

export function getPriority(app: Application): Priority {
  const missingCount = app.documents.filter((d) => !d.submitted).length;

  // Urgent: very old OR 2+ docs missing
  if (app.daysOld > 20 || missingCount >= 2) {
    return {
      level: "urgent",
      labelTe: "అత్యవసరం",
      reasonTe:
        missingCount >= 2
          ? `${missingCount} పత్రాలు మిస్ అవుతున్నాయి`
          : `${app.daysOld} రోజులు పెండింగ్‌లో ఉంది`,
    };
  }

  // Medium: 10+ days old OR 1 doc missing
  if (app.daysOld > 10 || missingCount === 1) {
    return {
      level: "medium",
      labelTe: "మధ్యస్థం",
      reasonTe:
        missingCount === 1
          ? `1 పత్రం మిస్ అవుతోంది`
          : `${app.daysOld} రోజులు పెండింగ్‌లో ఉంది`,
    };
  }

  // Normal: fresh, all docs submitted
  return {
    level: "normal",
    labelTe: "సాధారణం",
    reasonTe: "అన్ని పత్రాలు సమర్పించబడ్డాయి",
  };
}

export function sortByPriority(apps: Application[]): Application[] {
  const order: Record<PriorityLevel, number> = {
    urgent: 0,
    medium: 1,
    normal: 2,
  };
  return [...apps].sort((a, b) => {
    const pa = order[getPriority(a).level];
    const pb = order[getPriority(b).level];
    if (pa !== pb) return pa - pb;
    return b.daysOld - a.daysOld;
  });
}
