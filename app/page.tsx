"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { SkinScoreCard } from "@/components/skin-score-card"
import { CheckInCountdown } from "@/components/check-in-countdown"
import { ProgressSparkline } from "@/components/progress-sparkline"
import { RoutinePreview } from "@/components/routine-preview"
import LandingPage from "./landing/page"

// Mock data - in production this would come from a database
const mockData = {
  skinScore: 92,
  scoreChange: 4,
  daysUntilCheckIn: 3,
  hydration: {
    value: 78,
    history: [65, 68, 72, 70, 75, 76, 78],
  },
  texture: {
    value: 85,
    history: [78, 80, 79, 82, 83, 84, 85],
  },
  clarity: {
    value: 88,
    history: [82, 83, 85, 84, 86, 87, 88],
  },
  morningRoutine: [
    { id: "1", name: "Cleanser", done: true },
    { id: "2", name: "Toner", done: true },
    { id: "3", name: "Serum", done: false },
    { id: "4", name: "Moisturizer", done: false },
    { id: "5", name: "SPF", done: false },
  ],
  eveningRoutine: [
    { id: "1", name: "Oil Cleanser", done: false },
    { id: "2", name: "Water Cleanser", done: false },
    { id: "3", name: "Toner", done: false },
    { id: "4", name: "Treatment", done: false },
    { id: "5", name: "Moisturizer", done: false },
  ],
}

export default function DashboardPage() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null)
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

  useEffect(() => {
    // Check if user has completed onboarding
    const onboarded = localStorage.getItem("glowtrack-onboarded")
    setHasOnboarded(onboarded === "true")
  }, [])

  // Show loading state while checking
  if (hasOnboarded === null) {
    return null
  }

  // Show landing page for new users
  if (!hasOnboarded) {
    return <LandingPage />
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Greeting */}
        <section className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            {greeting}
          </span>
          <h1 className="font-serif italic text-3xl text-primary">Elena</h1>
        </section>

        {/* Skin Score */}
        <SkinScoreCard 
          score={mockData.skinScore} 
          change={mockData.scoreChange} 
        />

        {/* Check-in Countdown */}
        <CheckInCountdown daysUntilCheckIn={mockData.daysUntilCheckIn} />

        {/* Progress Metrics */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Your Progress</h2>
          <div className="grid grid-cols-2 gap-3">
            <ProgressSparkline
              title="Hydration"
              value={mockData.hydration.value}
              data={mockData.hydration.history}
            />
            <ProgressSparkline
              title="Texture"
              value={mockData.texture.value}
              data={mockData.texture.history}
            />
          </div>
          <ProgressSparkline
            title="Clarity"
            value={mockData.clarity.value}
            data={mockData.clarity.history}
            className="col-span-2"
          />
        </section>

        {/* Today's Routines */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">{"Today's Routines"}</h2>
          <div className="space-y-3">
            <RoutinePreview period="morning" steps={mockData.morningRoutine} />
            <RoutinePreview period="evening" steps={mockData.eveningRoutine} />
          </div>
        </section>
      </div>
    </AppShell>
  )
}
