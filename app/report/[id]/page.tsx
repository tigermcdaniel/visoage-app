"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import {
  ChevronLeft,
  Droplets,
  Sparkles,
  Sun,
  TrendingUp,
  TrendingDown,
  Zap,
  CircleDot,
  Moon,
  Loader2,
  Download,
  Share2,
} from "lucide-react"
import Link from "next/link"
import type { SkinAnalysisResult } from "@/lib/revieve"
import { ShareModal } from "@/components/share-modal"

// Inline type so generate-pdf.ts is never statically imported (avoids SSR jsPDF bundling)
interface FullReportData extends SkinAnalysisResult {
  capturedImage?: string
  analyzedAt?: string
  reportId?: string
  morningRoutine?: Array<{ name: string; product: string; duration?: string }>
  eveningRoutine?: Array<{ name: string; product: string; duration?: string }>
  products?: Array<{ name: string; brand: string; category: string }>
}

// ─── Demo fallback data ──────────────────────────────────────────────────────
const DEMO_REPORT = {
  id: "085",
  date: "April 1, 2026",
  skinAge: null as number | null,
  overallScore: 94,
  previousScore: 88,
  metrics: [
    { name: "Hydration", score: 92, change: 8, icon: Droplets },
    { name: "Texture", score: 88, change: 3, icon: Sparkles },
    { name: "Clarity", score: 95, change: 5, icon: Sun },
  ],
  insights: [
    {
      title: "Hydration Improved",
      description:
        "Your skin barrier is showing significant improvement. The hyaluronic acid serum is working well.",
      type: "positive" as const,
    },
    {
      title: "UV Damage Minimal",
      description:
        "Great SPF compliance! No new sun damage detected compared to your last analysis.",
      type: "positive" as const,
    },
    {
      title: "Watch T-Zone",
      description:
        "Slight increase in sebum production around the nose. Consider a gentle BHA treatment.",
      type: "neutral" as const,
    },
  ],
  recommendations: [
    "Continue with your current vitamin C serum",
    "Add a niacinamide treatment for T-zone",
    "Maintain SPF application consistency",
  ],
}

// ─── Metric icon map ─────────────────────────────────────────────────────────
const METRIC_ICONS: Record<string, React.ElementType> = {
  hydration: Droplets,
  texture: Sparkles,
  clarity: Sun,
  radiance: Zap,
  wrinkles: Moon,
  redness: CircleDot,
  oiliness: Droplets,
  acne: CircleDot,
  darkSpots: Sun,
  pores: CircleDot,
}

const METRIC_LABELS: Record<string, string> = {
  hydration: "Hydration",
  texture: "Texture",
  clarity: "Clarity",
  radiance: "Radiance",
  wrinkles: "Wrinkles",
  redness: "Redness",
  oiliness: "Oiliness",
  acne: "Acne",
  darkSpots: "Dark Spots",
  pores: "Pores",
}

// For wrinkles/redness/acne/oiliness, lower is better — invert the display
const INVERTED_METRICS = new Set(["wrinkles", "redness", "acne", "oiliness", "darkSpots", "pores"])

// ─── Component ───────────────────────────────────────────────────────────────
interface StoredAnalysis extends SkinAnalysisResult {
  capturedImage?: string
  analyzedAt?: string
}

export default function ReportPage() {
  const params = useParams()
  const reportId = (params?.id as string) ?? "085"
  const [liveData, setLiveData] = useState<StoredAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("visoage_analysis")
      if (raw) {
        const parsed: StoredAnalysis = JSON.parse(raw)
        // Only use it if the ID matches (or if the ID looks like our timestamp IDs)
        if (reportId !== "085" && reportId !== "084") {
          setLiveData(parsed)
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false)
    }
  }, [reportId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // ── If we have live Revieve data, render it ──────────────────────────────
  if (liveData) {
    return <LiveReport data={liveData} reportId={reportId} />
  }

  // ── Fall back to demo ────────────────────────────────────────────────────
  return <DemoReport reportId={reportId} />
}

// ─── Live Report (from Revieve SDK) ──────────────────────────────────────────
function LiveReport({ data, reportId }: { data: StoredAnalysis; reportId: string }) {
  const [downloading, setDownloading] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const date = data.analyzedAt
    ? new Date(data.analyzedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Today"

  async function handleDownload() {
    setDownloading(true)
    try {
      const { generateReportPDF } = await import("@/lib/generate-pdf")
      const reportData: FullReportData = { ...data, reportId }
      await generateReportPDF(reportData, data.capturedImage)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  const topMetrics = (
    ["hydration", "texture", "clarity", "radiance", "wrinkles", "acne"] as const
  )
    .filter((k) => data.metrics?.[k] !== undefined)
    .slice(0, 6)

  return (
    <AppShell showHeader={false}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link href="/profile" className="flex items-center gap-2 text-primary">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Analysis #{reportId}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
              aria-label="Share report"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        score={data.overallScore}
        reportId={reportId}
      />

      <div className="pt-16 space-y-8">
        {/* Hero Score */}
        <section className="text-center space-y-4">
          <div className="inline-flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
              {date}
            </span>
            <div className="relative mt-4">
              <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-6xl text-primary">{data.overallScore}</span>
              </div>
            </div>
            <h1 className="font-serif italic text-2xl text-primary mt-6">
              {data.overallScore >= 85
                ? "Excellent Skin Health"
                : data.overallScore >= 70
                ? "Good Skin Health"
                : "Room to Improve"}
            </h1>
            {data.skinAge != null && (
              <div className="mt-3 px-4 py-2 bg-primary/10 rounded-full">
                <p className="text-sm text-primary font-medium">
                  Skin Age: <span className="font-bold">{data.skinAge}</span>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Photo thumbnail */}
        {data.capturedImage && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-foreground">Analyzed Photo</h2>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] relative bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.capturedImage}
                alt="Analyzed face"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-xs text-white/70 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                  Skin Analysis
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Key Metrics */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Key Metrics</h2>
          <div className="grid grid-cols-3 gap-3">
            {topMetrics.map((key) => {
              const raw = data.metrics[key] ?? 0
              // For "problem" metrics (wrinkles, acne etc.), display as inverted score
              const displayScore = INVERTED_METRICS.has(key) ? 100 - raw : raw
              const Icon = METRIC_ICONS[key] ?? Sparkles
              return (
                <div
                  key={key}
                  className="bg-surface-container-lowest p-4 rounded-2xl text-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-primary">{displayScore}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                      {METRIC_LABELS[key]}
                    </p>
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      displayScore >= 70 ? "text-green-600" : displayScore >= 50 ? "text-yellow-600" : "text-red-500"
                    }`}
                  >
                    {displayScore >= 70 ? "Good" : displayScore >= 50 ? "Fair" : "Needs Work"}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Insights */}
        {data.insights && data.insights.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-foreground">Insights</h2>
            <div className="space-y-3">
              {data.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl ${
                    insight.type === "positive"
                      ? "bg-green-50 border border-green-100"
                      : insight.type === "negative"
                      ? "bg-red-50 border border-red-100"
                      : "bg-surface-container-low"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      insight.type === "positive"
                        ? "text-green-800"
                        : insight.type === "negative"
                        ? "text-red-800"
                        : "text-foreground"
                    }`}
                  >
                    {insight.title}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      insight.type === "positive"
                        ? "text-green-700"
                        : insight.type === "negative"
                        ? "text-red-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-foreground">Recommendations</h2>
            <div className="bg-primary/5 p-5 rounded-2xl space-y-3">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm text-primary">{rec}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Download button */}
        <section className="pb-10">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary text-white font-medium text-sm transition-all active:scale-95 disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Generating PDF…" : "Download Full Report"}
          </button>
        </section>
      </div>
    </AppShell>
  )
}

// ─── Demo / Static Report ─────────────────────────────────────────────────────
function DemoReport({ reportId }: { reportId: string }) {
  const report = DEMO_REPORT
  const scoreChange = report.overallScore - report.previousScore
  const [downloading, setDownloading] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const { generateReportPDF } = await import("@/lib/generate-pdf")
      const reportData: FullReportData = {
        skinAge: report.skinAge,
        overallScore: report.overallScore,
        metrics: {
          hydration: report.metrics.find((m) => m.name === "Hydration")?.score ?? 0,
          texture:   report.metrics.find((m) => m.name === "Texture")?.score ?? 0,
          clarity:   report.metrics.find((m) => m.name === "Clarity")?.score ?? 0,
          radiance:  0,
          wrinkles:  0,
          redness:   0,
          pores:     0,
          acne:      0,
          darkSpots: 0,
          oiliness:  0,
        },
        insights: report.insights,
        recommendations: report.recommendations,
        analyzedAt: new Date().toISOString(),
        reportId,
      }
      await generateReportPDF(reportData)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <AppShell showHeader={false}>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link href="/profile" className="flex items-center gap-2 text-primary">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Analysis #{reportId}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
              aria-label="Share report"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        score={report.overallScore}
        reportId={reportId}
      />

      <div className="pt-16 space-y-8">
        {/* Hero Score */}
        <section className="text-center space-y-4">
          <div className="inline-flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
              {report.date}
            </span>
            <div className="relative mt-4">
              <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-6xl text-primary">{report.overallScore}</span>
              </div>
              <div
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full ${
                  scoreChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {scoreChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-xs font-medium">
                  {scoreChange >= 0 ? "+" : ""}
                  {scoreChange} pts
                </span>
              </div>
            </div>
            <h1 className="font-serif italic text-2xl text-primary mt-6">Excellent Progress</h1>
          </div>
        </section>

        {/* Metrics */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Key Metrics</h2>
          <div className="grid grid-cols-3 gap-3">
            {report.metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.name} className="bg-surface-container-lowest p-4 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-primary">{metric.score}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                      {metric.name}
                    </p>
                  </div>
                  <div className={`text-xs font-medium ${metric.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Insights */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Insights</h2>
          <div className="space-y-3">
            {report.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl ${
                  insight.type === "positive"
                    ? "bg-green-50 border border-green-100"
                    : "bg-surface-container-low"
                }`}
              >
                <p className={`font-medium ${insight.type === "positive" ? "text-green-800" : "text-foreground"}`}>
                  {insight.title}
                </p>
                <p className={`text-sm mt-1 ${insight.type === "positive" ? "text-green-700" : "text-muted-foreground"}`}>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Recommendations</h2>
          <div className="bg-primary/5 p-5 rounded-2xl space-y-3">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-primary">{rec}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Download button */}
        <section className="pb-10">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary text-white font-medium text-sm transition-all active:scale-95 disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Generating PDF…" : "Download Full Report"}
          </button>
        </section>
      </div>
    </AppShell>
  )
}
