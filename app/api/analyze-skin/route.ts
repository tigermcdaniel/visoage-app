/**
 * POST /api/analyze-skin
 *
 * This endpoint receives completed analysis results from the client (Revieve SDK
 * runs browser-side since it's a browser-only library). The server can persist
 * results, enrich them, or forward them to a database.
 *
 * The Revieve SDK CANNOT run server-side (it accesses `window` at module load).
 * Analysis is performed in the browser via lib/revieve.ts, then optionally
 * submitted here for server-side persistence.
 */

import { NextRequest, NextResponse } from "next/server"
import type { SkinAnalysisResult } from "@/lib/revieve"

export interface StoredReport extends SkinAnalysisResult {
  reportId: string
  analyzedAt: string
  userId?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: SkinAnalysisResult & { userId?: string } = await req.json()

    if (!body || typeof body.overallScore !== "number") {
      return NextResponse.json({ error: "Invalid analysis data" }, { status: 400 })
    }

    const reportId = Date.now().toString().slice(-6)
    const report: StoredReport = {
      ...body,
      reportId,
      analyzedAt: new Date().toISOString(),
    }

    // TODO: Persist to your database (e.g. Supabase, Postgres, etc.)
    // await db.reports.create({ data: report })

    return NextResponse.json({ success: true, reportId: report.reportId, report })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[analyze-skin API]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
