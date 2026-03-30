"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { RoutineStep } from "@/components/routine-step"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  name: string
  product: string
  duration: string
  done: boolean
}

const initialMorningSteps: Step[] = [
  { id: "m1", name: "Gentle Cleanser", product: "CeraVe Hydrating Cleanser", duration: "1 min", done: false },
  { id: "m2", name: "Toner", product: "Paula's Choice BHA Liquid", duration: "30 sec", done: false },
  { id: "m3", name: "Vitamin C Serum", product: "Timeless 20% Vitamin C+E", duration: "1 min", done: false },
  { id: "m4", name: "Moisturizer", product: "La Roche-Posay Toleriane", duration: "30 sec", done: false },
  { id: "m5", name: "Sunscreen", product: "Supergoop Unseen SPF 40", duration: "1 min", done: false },
]

const initialEveningSteps: Step[] = [
  { id: "e1", name: "Oil Cleanser", product: "DHC Deep Cleansing Oil", duration: "2 min", done: false },
  { id: "e2", name: "Water Cleanser", product: "CeraVe Hydrating Cleanser", duration: "1 min", done: false },
  { id: "e3", name: "Exfoliant", product: "The Ordinary Glycolic Acid", duration: "30 sec", done: false },
  { id: "e4", name: "Treatment", product: "Tretinoin 0.025%", duration: "1 min", done: false },
  { id: "e5", name: "Night Cream", product: "CeraVe PM Moisturizer", duration: "30 sec", done: false },
]

export default function RoutinePage() {
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning")
  const [morningSteps, setMorningSteps] = useState(initialMorningSteps)
  const [eveningSteps, setEveningSteps] = useState(initialEveningSteps)

  const steps = activeTab === "morning" ? morningSteps : eveningSteps
  const setSteps = activeTab === "morning" ? setMorningSteps : setEveningSteps

  const completedCount = steps.filter(s => s.done).length
  const progress = (completedCount / steps.length) * 100

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, done: !step.done } : step
    ))
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <section className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            Daily Routine
          </span>
          <h1 className="font-serif italic text-3xl text-primary">Your Ritual</h1>
        </section>

        {/* Tab Switcher */}
        <div className="flex bg-surface-container rounded-2xl p-1.5">
          <button
            onClick={() => setActiveTab("morning")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
              activeTab === "morning"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Sun className="h-4 w-4" />
            Morning
          </button>
          <button
            onClick={() => setActiveTab("evening")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
              activeTab === "evening"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Moon className="h-4 w-4" />
            Evening
          </button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-primary">
              {completedCount}/{steps.length} steps
            </span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <RoutineStep
              key={step.id}
              step={index + 1}
              name={step.name}
              product={step.product}
              duration={step.duration}
              done={step.done}
              onToggle={() => toggleStep(step.id)}
            />
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === steps.length && (
          <div className="bg-primary-fixed p-6 rounded-2xl text-center space-y-2">
            <p className="font-serif text-xl text-primary">Routine Complete!</p>
            <p className="text-sm text-primary/70">
              Great job taking care of your skin today
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
