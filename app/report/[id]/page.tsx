import { AppShell } from "@/components/app-shell"
import { ChevronLeft, Droplets, Sparkles, Sun, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock report data
const reportData = {
  id: "084",
  date: "October 12, 2023",
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
      description: "Your skin barrier is showing significant improvement. The hyaluronic acid serum is working well.",
      type: "positive" as const,
    },
    {
      title: "UV Damage Minimal",
      description: "Great SPF compliance! No new sun damage detected compared to your last analysis.",
      type: "positive" as const,
    },
    {
      title: "Watch T-Zone",
      description: "Slight increase in sebum production around the nose. Consider a gentle BHA treatment.",
      type: "neutral" as const,
    },
  ],
  recommendations: [
    "Continue with your current vitamin C serum",
    "Add a niacinamide treatment for T-zone",
    "Maintain SPF application consistency",
  ],
}

export default function ReportPage() {
  const scoreChange = reportData.overallScore - reportData.previousScore

  return (
    <AppShell showHeader={false}>
      {/* Custom Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl px-4 py-4 safe-top">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link href="/profile" className="flex items-center gap-2 text-primary">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Analysis #{reportData.id}
          </span>
          <div className="w-16" />
        </div>
      </div>

      <div className="pt-16 space-y-8">
        {/* Hero Score */}
        <section className="text-center space-y-4">
          <div className="inline-flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
              {reportData.date}
            </span>
            <div className="relative mt-4">
              <div className="w-40 h-40 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="font-serif text-6xl text-primary">{reportData.overallScore}</span>
              </div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full ${
                scoreChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {scoreChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-xs font-medium">
                  {scoreChange >= 0 ? "+" : ""}{scoreChange} pts
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
            {reportData.metrics.map((metric) => {
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
                  <div className={`text-xs font-medium ${
                    metric.change >= 0 ? "text-green-600" : "text-red-500"
                  }`}>
                    {metric.change >= 0 ? "+" : ""}{metric.change}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Face Heatmap Placeholder */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Analysis Map</h2>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden aspect-[4/3] relative">
            <Image
              src="/images/profile.jpg"
              alt="Face analysis"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Interactive heatmap</p>
                <p className="text-xs">Tap areas for details</p>
              </div>
            </div>
          </div>
        </section>

        {/* Insights */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Insights</h2>
          <div className="space-y-3">
            {reportData.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl ${
                  insight.type === "positive"
                    ? "bg-green-50 border border-green-100"
                    : "bg-surface-container-low"
                }`}
              >
                <p className={`font-medium ${
                  insight.type === "positive" ? "text-green-800" : "text-foreground"
                }`}>
                  {insight.title}
                </p>
                <p className={`text-sm mt-1 ${
                  insight.type === "positive" ? "text-green-700" : "text-muted-foreground"
                }`}>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="space-y-4 pb-4">
          <h2 className="font-serif text-xl text-foreground">Recommendations</h2>
          <div className="bg-primary-fixed p-5 rounded-2xl space-y-3">
            {reportData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-primary">{rec}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
