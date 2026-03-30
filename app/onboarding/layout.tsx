"use client"

import { Sparkles } from "lucide-react"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm">
        <div className="flex justify-center items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-2xl font-serif italic tracking-tight text-primary">GlowTrack</span>
          </div>
        </div>
      </header>
      
      <main className="pt-20 pb-32 px-6 min-h-screen">
        {children}
      </main>
    </div>
  )
}
