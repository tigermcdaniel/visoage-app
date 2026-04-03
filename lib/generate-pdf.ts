/**
 * Visoage PDF Report Generator
 *
 * Generates a professional PDF export of a skin analysis report using jsPDF.
 * Designed to work client-side only (browser).
 */

import type { SkinAnalysisResult } from "@/lib/revieve"

// ─── Brand colors ─────────────────────────────────────────────────────────────
const BRAND_PRIMARY = "#7A9A9C"      // teal-grey primary
const BRAND_ACCENT  = "#B3C4C5"      // lighter teal-grey accent
const BRAND_DARK    = "#2C4A4C"      // dark teal for headings
const BRAND_LIGHT   = "#E8F0F0"      // very light teal for backgrounds
const TEXT_DARK     = "#1A2E2E"
const TEXT_MID      = "#4A6A6C"
const TEXT_LIGHT    = "#8AACAE"

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ReportData extends SkinAnalysisResult {
  capturedImage?: string
  analyzedAt?: string
  reportId?: string
}

interface MorningEveningStep {
  name: string
  product: string
  duration?: string
}

export interface FullReportData extends ReportData {
  morningRoutine?: MorningEveningStep[]
  eveningRoutine?: MorningEveningStep[]
  products?: Array<{ name: string; brand: string; category: string }>
}

// ─── Default routine data (used if not passed in) ─────────────────────────────
const DEFAULT_MORNING: MorningEveningStep[] = [
  { name: "Gentle Cleanser",   product: "CeraVe Hydrating Cleanser",     duration: "1 min"  },
  { name: "Toner",             product: "Paula's Choice BHA Liquid",      duration: "30 sec" },
  { name: "Vitamin C Serum",   product: "Timeless 20% Vitamin C+E",       duration: "1 min"  },
  { name: "Moisturizer",       product: "La Roche-Posay Toleriane",       duration: "30 sec" },
  { name: "Sunscreen",         product: "Supergoop Unseen SPF 40",        duration: "1 min"  },
]

const DEFAULT_EVENING: MorningEveningStep[] = [
  { name: "Oil Cleanser",      product: "DHC Deep Cleansing Oil",         duration: "2 min"  },
  { name: "Water Cleanser",    product: "CeraVe Hydrating Cleanser",      duration: "1 min"  },
  { name: "Exfoliant",         product: "The Ordinary Glycolic Acid",     duration: "30 sec" },
  { name: "Treatment",         product: "Tretinoin 0.025%",               duration: "1 min"  },
  { name: "Night Cream",       product: "CeraVe PM Moisturizer",          duration: "30 sec" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function setFillColor(doc: import("jspdf").jsPDF, hex: string) {
  doc.setFillColor(...hexToRgb(hex))
}

function setTextColor(doc: import("jspdf").jsPDF, hex: string) {
  doc.setTextColor(...hexToRgb(hex))
}

function setDrawColor(doc: import("jspdf").jsPDF, hex: string) {
  doc.setDrawColor(...hexToRgb(hex))
}

const INVERTED_METRICS = new Set(["wrinkles", "redness", "acne", "oiliness", "darkSpots", "pores"])

const METRIC_LABELS: Record<string, string> = {
  hydration: "Hydration",
  texture:   "Texture",
  clarity:   "Clarity",
  radiance:  "Radiance",
  wrinkles:  "Wrinkles",
  redness:   "Redness",
  oiliness:  "Oiliness",
  acne:      "Acne",
  darkSpots: "Dark Spots",
  pores:     "Pores",
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 65) return "Good"
  if (score >= 50) return "Fair"
  return "Needs Work"
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e"
  if (score >= 65) return "#84cc16"
  if (score >= 50) return "#eab308"
  return "#ef4444"
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateReportPDF(
  reportData: FullReportData,
  uploadedImage?: string
): Promise<void> {
  // Dynamic import so this never runs during SSR
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const PAGE_W    = 210
  const PAGE_H    = 297
  const MARGIN    = 16
  const COL_W     = PAGE_W - MARGIN * 2
  let y           = 0

  // ── Page helpers ─────────────────────────────────────────────────────────
  function checkPageBreak(needed: number) {
    if (y + needed > PAGE_H - 20) {
      doc.addPage()
      y = MARGIN
      drawHeader()
    }
  }

  function drawHeader() {
    // Thin accent bar at top
    setFillColor(doc, BRAND_ACCENT)
    doc.rect(0, 0, PAGE_W, 6, "F")
    // Brand name
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    setTextColor(doc, BRAND_PRIMARY)
    doc.text("VISOAGE", MARGIN, 14)
    // Right: report label
    doc.setFont("helvetica", "normal")
    setTextColor(doc, TEXT_LIGHT)
    doc.text("Skin Analysis Report", PAGE_W - MARGIN, 14, { align: "right" })
    // Divider
    setDrawColor(doc, BRAND_ACCENT)
    doc.setLineWidth(0.3)
    doc.line(MARGIN, 17, PAGE_W - MARGIN, 17)
    y = 22
  }

  function drawSectionTitle(title: string) {
    checkPageBreak(12)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    setTextColor(doc, BRAND_DARK)
    doc.text(title.toUpperCase(), MARGIN, y)
    // Underline
    setDrawColor(doc, BRAND_ACCENT)
    doc.setLineWidth(0.5)
    doc.line(MARGIN, y + 1.5, MARGIN + 30, y + 1.5)
    y += 7
  }

  // ── Cover page ────────────────────────────────────────────────────────────
  // Background gradient-ish block
  setFillColor(doc, BRAND_LIGHT)
  doc.rect(0, 0, PAGE_W, PAGE_H, "F")

  // Top accent
  setFillColor(doc, BRAND_PRIMARY)
  doc.rect(0, 0, PAGE_W, 8, "F")

  // Brand wordmark
  doc.setFont("helvetica", "bold")
  doc.setFontSize(32)
  setTextColor(doc, BRAND_DARK)
  doc.text("VISOAGE", PAGE_W / 2, 55, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(13)
  setTextColor(doc, TEXT_MID)
  doc.text("Skin Analysis Report", PAGE_W / 2, 64, { align: "center" })

  // Date line
  const dateStr = reportData.analyzedAt
    ? new Date(reportData.analyzedAt).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })

  doc.setFontSize(10)
  setTextColor(doc, TEXT_LIGHT)
  doc.text(dateStr, PAGE_W / 2, 72, { align: "center" })

  // Photo (centered, if available)
  const photoSize = 60
  const photoX = (PAGE_W - photoSize) / 2
  const photoY = 85

  const imageSource = uploadedImage ?? reportData.capturedImage

  if (imageSource) {
    try {
      // Draw rounded-rect placeholder behind photo
      setFillColor(doc, "#ffffff")
      doc.roundedRect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4, 4, 4, "F")
      doc.addImage(imageSource, "JPEG", photoX, photoY, photoSize, photoSize)
    } catch {
      // Ignore image errors (e.g., unsupported format)
    }
  }

  // Overall score circle
  const circleY = imageSource ? photoY + photoSize + 20 : photoY + 15
  setFillColor(doc, "#ffffff")
  doc.circle(PAGE_W / 2, circleY, 22, "F")
  setDrawColor(doc, BRAND_PRIMARY)
  doc.setLineWidth(1.5)
  doc.circle(PAGE_W / 2, circleY, 22, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(26)
  setTextColor(doc, BRAND_DARK)
  doc.text(String(reportData.overallScore), PAGE_W / 2, circleY + 4, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  setTextColor(doc, TEXT_MID)
  doc.text("OVERALL SCORE", PAGE_W / 2, circleY + 11, { align: "center" })

  // Skin health label
  const healthLabel =
    reportData.overallScore >= 85 ? "Excellent Skin Health"
    : reportData.overallScore >= 70 ? "Good Skin Health"
    : "Room to Improve"

  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  setTextColor(doc, BRAND_PRIMARY)
  doc.text(healthLabel, PAGE_W / 2, circleY + 22, { align: "center" })

  // Skin age (if available)
  if (reportData.skinAge != null) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    setTextColor(doc, TEXT_MID)
    doc.text(`Skin Age: ${reportData.skinAge}`, PAGE_W / 2, circleY + 30, { align: "center" })
  }

  // Report ID footer
  if (reportData.reportId) {
    doc.setFontSize(8)
    setTextColor(doc, TEXT_LIGHT)
    doc.text(`Report #${reportData.reportId}`, PAGE_W / 2, PAGE_H - 12, { align: "center" })
  }

  // Bottom accent
  setFillColor(doc, BRAND_ACCENT)
  doc.rect(0, PAGE_H - 5, PAGE_W, 5, "F")

  // ── Page 2: Metrics + Insights + Recommendations ──────────────────────────
  doc.addPage()
  drawHeader()

  // ── Key Metrics ─────────────────────────────────────────────────────────
  drawSectionTitle("Key Metrics")

  const metricKeys = (
    ["hydration", "texture", "clarity", "radiance", "wrinkles", "acne",
     "redness", "oiliness", "darkSpots", "pores"] as const
  ).filter((k) => reportData.metrics?.[k] !== undefined)

  const colCount = 3
  const cellW = COL_W / colCount
  const cellH = 22
  const cellPad = 3

  metricKeys.forEach((key, i) => {
    const raw = reportData.metrics[key] ?? 0
    const displayScore = INVERTED_METRICS.has(key) ? 100 - raw : raw
    const col = i % colCount
    const row = Math.floor(i / colCount)
    const cx = MARGIN + col * cellW
    const cy = y + row * (cellH + cellPad)

    checkPageBreak(cellH + cellPad)

    // Card background
    setFillColor(doc, "#ffffff")
    doc.roundedRect(cx, cy, cellW - 2, cellH, 3, 3, "F")
    setDrawColor(doc, BRAND_ACCENT)
    doc.setLineWidth(0.3)
    doc.roundedRect(cx, cy, cellW - 2, cellH, 3, 3, "S")

    // Score bar
    const barX = cx + 4
    const barY = cy + cellH - 5
    const barMaxW = cellW - 10
    setFillColor(doc, BRAND_LIGHT)
    doc.rect(barX, barY, barMaxW, 2, "F")
    setFillColor(doc, scoreColor(displayScore))
    doc.rect(barX, barY, barMaxW * (displayScore / 100), 2, "F")

    // Score number
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    setTextColor(doc, BRAND_DARK)
    doc.text(String(displayScore), cx + 6, cy + 10)

    // Label
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    setTextColor(doc, TEXT_MID)
    doc.text((METRIC_LABELS[key] ?? key).toUpperCase(), cx + 6, cy + 15)

    // Status
    doc.setFontSize(6)
    setTextColor(doc, scoreColor(displayScore))
    doc.text(scoreLabel(displayScore), cx + cellW - 14, cy + 10)
  })

  const rowCount = Math.ceil(metricKeys.length / colCount)
  y += rowCount * (cellH + cellPad) + 6

  // ── Insights / Areas of Focus ────────────────────────────────────────────
  if (reportData.insights && reportData.insights.length > 0) {
    drawSectionTitle("Areas of Focus")

    for (const insight of reportData.insights) {
      checkPageBreak(20)

      const bgColor =
        insight.type === "positive" ? "#f0fdf4"
        : insight.type === "negative" ? "#fef2f2"
        : "#f8f9fa"

      const borderColor =
        insight.type === "positive" ? "#bbf7d0"
        : insight.type === "negative" ? "#fecaca"
        : BRAND_ACCENT

      const dotColor =
        insight.type === "positive" ? "#22c55e"
        : insight.type === "negative" ? "#ef4444"
        : BRAND_PRIMARY

      // Card
      setFillColor(doc, bgColor)
      doc.roundedRect(MARGIN, y, COL_W, 18, 2, 2, "F")
      setDrawColor(doc, borderColor)
      doc.setLineWidth(0.3)
      doc.roundedRect(MARGIN, y, COL_W, 18, 2, 2, "S")

      // Dot indicator
      setFillColor(doc, dotColor)
      doc.circle(MARGIN + 5, y + 6, 2, "F")

      // Title
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      setTextColor(doc, TEXT_DARK)
      doc.text(insight.title, MARGIN + 11, y + 6)

      // Description
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      setTextColor(doc, TEXT_MID)
      const lines = doc.splitTextToSize(insight.description, COL_W - 15)
      doc.text(lines[0] ?? "", MARGIN + 11, y + 12)

      y += 21
    }
    y += 2
  }

  // ── Recommendations ──────────────────────────────────────────────────────
  if (reportData.recommendations && reportData.recommendations.length > 0) {
    checkPageBreak(15)
    drawSectionTitle("Product Recommendations")

    setFillColor(doc, BRAND_LIGHT)
    const recBlockH = reportData.recommendations.length * 10 + 8
    doc.roundedRect(MARGIN, y, COL_W, recBlockH, 3, 3, "F")

    reportData.recommendations.forEach((rec, i) => {
      checkPageBreak(10)
      // Number bubble
      setFillColor(doc, BRAND_ACCENT)
      doc.circle(MARGIN + 6, y + 5, 3.5, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(7)
      setTextColor(doc, "#ffffff")
      doc.text(String(i + 1), MARGIN + 6, y + 6.5, { align: "center" })

      // Text
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      setTextColor(doc, TEXT_DARK)
      const recLines = doc.splitTextToSize(rec, COL_W - 16)
      doc.text(recLines[0] ?? "", MARGIN + 14, y + 6)
      y += 10
    })
    y += 8
  }

  // ── Routines (Page 3) ────────────────────────────────────────────────────
  const morning = reportData.morningRoutine ?? DEFAULT_MORNING
  const evening = reportData.eveningRoutine ?? DEFAULT_EVENING

  doc.addPage()
  drawHeader()

  // Morning Routine
  drawSectionTitle("Morning Routine")
  drawRoutineSteps(doc, morning, y, MARGIN, COL_W)
  y += morning.length * 14 + 6

  // Evening Routine
  checkPageBreak(30)
  drawSectionTitle("Evening Routine")
  drawRoutineSteps(doc, evening, y, MARGIN, COL_W)
  y += evening.length * 14 + 6

  // ── Footer on last page ───────────────────────────────────────────────────
  doc.setFontSize(7)
  setTextColor(doc, TEXT_LIGHT)
  const footerY = PAGE_H - 12
  doc.text("Generated by Visoage · visoage.com", MARGIN, footerY)
  doc.text(
    new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    PAGE_W - MARGIN, footerY, { align: "right" }
  )
  setFillColor(doc, BRAND_ACCENT)
  doc.rect(0, PAGE_H - 5, PAGE_W, 5, "F")

  // ── Save ──────────────────────────────────────────────────────────────────
  const datePart = new Date().toISOString().split("T")[0]
  doc.save(`visoage-skin-report-${datePart}.pdf`)
}

// ─── Routine step renderer (extracted for clarity) ────────────────────────────
function drawRoutineSteps(
  doc: import("jspdf").jsPDF,
  steps: MorningEveningStep[],
  startY: number,
  margin: number,
  colW: number
) {
  let y = startY

  steps.forEach((step, i) => {
    // Step row background (alternating)
    if (i % 2 === 0) {
      setFillColor(doc, BRAND_LIGHT)
      doc.rect(margin, y, colW, 13, "F")
    }

    // Step number
    setFillColor(doc, BRAND_PRIMARY)
    doc.circle(margin + 5, y + 6.5, 4, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    setTextColor(doc, "#ffffff")
    doc.text(String(i + 1), margin + 5, y + 8, { align: "center" })

    // Step name
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    setTextColor(doc, TEXT_DARK)
    doc.text(step.name, margin + 13, y + 6)

    // Product name
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    setTextColor(doc, TEXT_MID)
    doc.text(step.product, margin + 13, y + 11)

    // Duration (right-aligned)
    if (step.duration) {
      doc.setFontSize(7)
      setTextColor(doc, TEXT_LIGHT)
      doc.text(step.duration, margin + colW - 2, y + 6, { align: "right" })
    }

    y += 14
  })
}
