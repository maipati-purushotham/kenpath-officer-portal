import { NextRequest, NextResponse } from "next/server";
import { DecisionRequestSchema } from "@/lib/types";
import { applications } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { log } from "@/lib/logger";

// In-memory audit log (demo — use DB in production)
const auditLog: Array<{
  ts: string;
  username: string;
  applicationId: string;
  status: string;
  remarks: string;
}> = [];

export async function POST(req: NextRequest) {
  const username = await getSession();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = DecisionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { applicationId, status, remarks } = parsed.data;

  // Find application (in real app: DB query)
  const app = applications.find((a) => a.id === applicationId);
  if (!app) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  // Update status (in-memory; demo only)
  app.status = status;

  // Audit log
  const entry = {
    ts: new Date().toISOString(),
    username,
    applicationId,
    status,
    remarks,
  };
  auditLog.push(entry);

  log("info", "decision_recorded", entry);

  return NextResponse.json({
    ok: true,
    applicationId,
    status,
    decidedBy: username,
  });
}

export async function GET(req: NextRequest) {
  const username = await getSession();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ auditLog });
}
