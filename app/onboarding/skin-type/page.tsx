"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Droplets, Sun, Wind, Layers } from "lucide-react"
import { OnboardingProgress } from "@/components/onboarding-progress"

const skinTypes = [
  {
    id: "oily",
    title: "Oily",
    description: "Shiny appearance, enlarged pores, prone to breakouts",
    icon: Droplets,
  },
  {
    id: "dry",
    title: "Dry",
    description: "Tight feeling, flaky patches, dull complexion",
    icon: Wind,
  },
  {
    id: "combination",
    title: "Combination",
    description: "Oily T-zone, normal to dry cheeks",
    icon: Layers,
  },
  {
    id: "sensitive",
    title: "Sensitive",
    description: "Easily irritated, redness, reactive to products",
    icon: Sun,
  },
  {
    id: "normal",
    title: "Normal",
    description: "Balanced, few imperfections, even texture",
    icon: Check,
  },
]

export default function SkinTypeStep() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-16" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Step 3 of 4</span>
        <button
          onClick={() => router.push("/onboarding/cabinet")}
          className="text-xs uppercase tracking-widest text-primary font-semibold hover:underline"
        >
          Skip
        </button>
      </div>

      {/* Hero */}
      <section className="mb-10">
        <h1 className="font-serif text-4xl text-foreground mb-3 leading-tight">
          What&apos;s your <span className="italic text-primary">skin type?</span>
        </h1>
        <p className="text-muted-foreground max-w-md">
          Understanding your skin type helps us recommend the right products and routines.
        </p>
      </section>

      {/* Skin Type Options */}
      <div className="space-y-3 mb-8">
        {skinTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`w-full group flex items-center justify-between p-5 rounded-xl shadow-sm transition-all duration-300 text-left ${
                isSelected 
                  ? "bg-primary/10 border-2 border-primary" 
                  : "bg-card border-2 border-transparent hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground">{type.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {type.description}
                  </p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected 
                  ? "bg-primary border-primary" 
                  : "border-border"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Info Card */}
      <div className="bg-primary-fixed rounded-2xl p-6 mb-8">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Not sure?</p>
        <p className="text-sm text-foreground leading-relaxed">
          After cleansing, wait 30 minutes without applying products. If your skin feels tight, it&apos;s likely dry. 
          If it looks shiny, it&apos;s oily. A mix of both? Combination.
        </p>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/onboarding/cabinet")}
            disabled={!selectedType}
            className={`w-full py-4 rounded-full font-semibold text-sm uppercase tracking-widest shadow-lg transition-all ${
              selectedType
                ? "bg-gradient-to-r from-primary to-primary-container text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Continue
          </button>
          <button
            onClick={() => router.push("/onboarding/goals")}
            className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="mt-3">
            <OnboardingProgress currentStep={3} />
          </div>
        </div>
      </div>
    </div>
  )
}
