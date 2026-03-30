"use client"

import { Sun, Moon, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RoutineStep {
  id: string
  name: string
  done: boolean
}

interface RoutinePreviewProps {
  period: "morning" | "evening"
  steps: RoutineStep[]
  className?: string
}

export function RoutinePreview({ period, steps, className }: RoutinePreviewProps) {
  const completedCount = steps.filter(s => s.done).length
  const Icon = period === "morning" ? Sun : Moon
  
  return (
    <Link href="/routine" className="block">
      <div className={cn(
        "bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-[0px_10px_30px_rgba(25,28,28,0.02)] hover:translate-x-1 transition-transform group",
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-lg text-foreground capitalize">{period} Routine</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                {completedCount}/{steps.length} steps done
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    step.done ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
          </div>
        </div>
      </div>
    </Link>
  )
}
