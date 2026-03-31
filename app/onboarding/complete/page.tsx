"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Sparkles, Sun, Moon, ArrowRight } from "lucide-react"

const routineSteps = {
  morning: [
    { step: 1, name: "Gentle Cleanse", product: "Hydrating Cleanser", duration: "60 sec" },
    { step: 2, name: "Vitamin C Serum", product: "Brightening Complex", duration: "Let absorb" },
    { step: 3, name: "Moisturize", product: "Daily Hydrator", duration: "Apply evenly" },
    { step: 4, name: "Protect", product: "SPF 50 Sunscreen", duration: "Last step" },
  ],
  evening: [
    { step: 1, name: "Double Cleanse", product: "Oil + Foam Cleanser", duration: "2 min" },
    { step: 2, name: "Treatment", product: "Retinol 0.5%", duration: "Apply thin layer" },
    { step: 3, name: "Hydrate", product: "Hyaluronic Acid", duration: "While damp" },
    { step: 4, name: "Seal", product: "Night Cream", duration: "Massage gently" },
  ],
}

export default function CompletePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(true)
  const [showRoutine, setShowRoutine] = useState(false)
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning")

  useEffect(() => {
    // Simulate routine generation
    const timer = setTimeout(() => {
      setIsGenerating(false)
      setTimeout(() => setShowRoutine(true), 500)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-pulse">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-4">
          Creating Your <span className="italic text-primary">Perfect Routine</span>
        </h1>
        <p className="text-muted-foreground max-w-sm mb-8">
          Analyzing your skin profile, goals, and cabinet to build a personalized regimen...
        </p>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full"
            style={{ 
              animation: "loading 3s ease-in-out forwards",
            }} 
          />
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <section className={`text-center mb-10 transition-all duration-500 ${showRoutine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-3">
          Your Routine is <span className="italic text-primary">Ready</span>
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Based on your skin analysis and goals, we&apos;ve crafted a personalized daily routine.
        </p>
      </section>

      {/* Tab Switcher */}
      <div className={`flex bg-muted rounded-xl p-1 mb-6 transition-all duration-500 delay-100 ${showRoutine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <button
          onClick={() => setActiveTab("morning")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === "morning"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Sun className="w-4 h-4" />
          Morning
        </button>
        <button
          onClick={() => setActiveTab("evening")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === "evening"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Moon className="w-4 h-4" />
          Evening
        </button>
      </div>

      {/* Routine Steps */}
      <div className={`space-y-3 mb-8 transition-all duration-500 delay-200 ${showRoutine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {routineSteps[activeTab].map((item, index) => (
          <div
            key={item.step}
            className="bg-card rounded-xl p-4 flex items-center gap-4 shadow-sm"
            style={{ 
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{item.step}</span>
            </div>
            <div className="flex-grow">
              <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-0.5">
                Step {item.step.toString().padStart(2, "0")}
              </p>
              <h3 className="font-serif text-lg text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.product}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {item.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className={`bg-primary-fixed rounded-2xl p-6 mb-32 transition-all duration-500 delay-300 ${showRoutine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Your Skin Journey Begins</p>
        <p className="text-sm text-foreground leading-relaxed">
          We&apos;ll track your progress and adjust your routine as your skin evolves. 
          Your first check-in is scheduled in 7 days.
        </p>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              localStorage.setItem("visoage-onboarded", "true")
              router.push("/")
            }}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-primary-foreground rounded-full font-semibold text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            Start My Journey
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center mt-3 text-muted-foreground text-[10px] uppercase tracking-widest">
            Welcome to VisoAge
          </p>
        </div>
      </div>
    </div>
  )
}
