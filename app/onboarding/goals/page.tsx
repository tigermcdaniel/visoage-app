"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Sparkles, Sun, Droplets, Leaf, Check } from "lucide-react"

const goals = [
  {
    id: "acne",
    title: "Clear Acne",
    subtitle: "Purifying Focus",
    icon: Leaf,
    bgColor: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    id: "fine-lines",
    title: "Reduce Fine Lines",
    subtitle: "Renewal Therapy",
    icon: Sparkles,
    bgColor: "bg-secondary/20",
    iconColor: "text-secondary-foreground",
  },
  {
    id: "brighten",
    title: "Brighten Tone",
    subtitle: "Luminosity Boost",
    icon: Sun,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: "soothe",
    title: "Soothe Sensitivity",
    subtitle: "Calming Protocol",
    icon: Droplets,
    bgColor: "bg-primary-fixed",
    iconColor: "text-primary",
  },
]

export default function GoalsStep() {
  const router = useRouter()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Step 2 of 4</span>
      </div>

      {/* Hero */}
      <section className="mb-10">
        <h1 className="font-serif text-4xl text-foreground mb-3 leading-tight">
          What are your <span className="italic text-primary">goals?</span>
        </h1>
        <p className="text-muted-foreground max-w-md">
          Select the skin concerns you&apos;d like to address. We&apos;ll tailor your routine accordingly.
        </p>
      </section>

      {/* Goals Grid */}
      <div className="space-y-4 mb-8">
        {goals.map((goal) => {
          const Icon = goal.icon
          const isSelected = selectedGoals.includes(goal.id)
          
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full group flex items-center justify-between p-5 rounded-xl shadow-sm transition-all duration-300 text-left ${
                isSelected 
                  ? "bg-primary/10 border-2 border-primary" 
                  : "bg-card border-2 border-transparent hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-full ${goal.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${goal.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground">{goal.title}</h3>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">
                    {goal.subtitle}
                  </p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected 
                  ? "bg-primary border-primary" 
                  : "border-border"
              }`}>
                {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Visual Anchor */}
      <div className="rounded-2xl overflow-hidden h-40 relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent z-10" />
        <Image
          src="/images/botanical-lab.jpg"
          alt="Lab glass with natural herbs"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-5 left-5 z-20">
          <p className="font-serif text-white text-xl italic">Precision meets Nature.</p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/onboarding/skin-type")}
            disabled={selectedGoals.length === 0}
            className={`w-full py-4 rounded-full font-semibold text-sm uppercase tracking-widest shadow-lg transition-all ${
              selectedGoals.length > 0
                ? "bg-gradient-to-r from-primary to-primary-container text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Continue
          </button>
          <button
            onClick={() => router.push("/onboarding/scan")}
            className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <p className="text-center mt-2 text-muted-foreground text-[10px] uppercase tracking-widest">
            Step 2 of 4 • Goals Selection
          </p>
        </div>
      </div>
    </div>
  )
}
