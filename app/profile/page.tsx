import { AppShell } from "@/components/app-shell"
import { ChevronRight, User, Shield, FileText, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const reports = [
  { id: "084", date: "October 12, 2023", score: 94 },
  { id: "083", date: "September 28, 2023", score: 88 },
  { id: "082", date: "September 14, 2023", score: 82 },
]

const skinJourneyData = [
  { week: "Week 1", score: 78 },
  { week: "Week 2", score: 82 },
  { week: "Week 3", score: 80 },
  { week: "Current", score: 92 },
  { week: "Week 5", score: 88 },
  { week: "Week 6", score: 94 },
]

const settingsLinks = [
  { href: "#", icon: User, label: "Account Settings" },
  { href: "#", icon: Shield, label: "Privacy & Data" },
  { href: "#", icon: Settings, label: "Preferences" },
]

export default function ProfilePage() {
  const maxScore = Math.max(...skinJourneyData.map(d => d.score))

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Profile Header */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                Patient Profile
              </span>
              <h1 className="font-serif italic text-4xl text-primary leading-none">Elena Vance</h1>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                Skin Age
              </span>
              <span className="font-serif text-3xl text-primary">24</span>
            </div>
          </div>
        </section>

        {/* Skin Journey Graph */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">Skin Journey</h2>
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Last 30 Days</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-[0px_20px_40px_rgba(25,28,28,0.04)]">
            <div className="flex items-end justify-between h-40 gap-2">
              {skinJourneyData.map((item, index) => {
                const height = (item.score / maxScore) * 100
                const isCurrent = item.week === "Current"
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <span className={`text-[10px] font-bold ${isCurrent ? "text-primary" : "text-transparent"}`}>
                      {item.score}
                    </span>
                    <div
                      className={`w-full rounded-t-full transition-all ${
                        isCurrent ? "bg-primary/40" : "bg-surface-container-low hover:bg-primary/20"
                      }`}
                      style={{ height: `${height}%` }}
                    >
                      {isCurrent && <div className="w-full h-1 bg-primary rounded-full mt-auto" />}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Current</span>
            </div>
          </div>
        </section>

        {/* Personal Details */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Personal Details</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-5 rounded-[1.5rem] space-y-3">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                Skin Type
              </span>
              <div>
                <p className="font-serif text-2xl text-primary">Combination</p>
                <p className="text-xs text-muted-foreground">Oily T-zone, dry cheeks</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-[1.5rem] space-y-3">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                Focus Area
              </span>
              <div>
                <p className="font-serif text-2xl text-primary">Hydration</p>
                <p className="text-xs text-muted-foreground">Barrier repair priority</p>
              </div>
            </div>
            <div className="col-span-2 bg-primary-fixed p-5 rounded-[1.5rem] flex items-center justify-between">
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                  Primary Goal
                </span>
                <p className="font-serif text-xl text-primary">Reduce Hyperpigmentation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Deep Reports */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">Deep Reports</h2>
            <button className="text-[10px] uppercase tracking-widest text-primary font-bold hover:underline">
              Export All
            </button>
          </div>
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="group bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-[0px_10px_30px_rgba(25,28,28,0.02)] flex items-center justify-between hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-foreground">Analysis #{report.id}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                      {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-serif text-xl text-primary">{report.score}</p>
                    <p className="text-[8px] uppercase tracking-widest text-muted-foreground/60 font-bold">Score</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="pb-4">
          <div className="bg-surface-container-high/50 rounded-[2rem] p-2 space-y-1">
            {settingsLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] hover:bg-surface-container-lowest transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[11px] uppercase tracking-widest font-bold text-foreground">
                      {link.label}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
