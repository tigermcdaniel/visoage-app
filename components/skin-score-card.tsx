"use client"

import { cn } from "@/lib/utils"

interface SkinScoreCardProps {
  score: number
  change?: number
  className?: string
}

export function SkinScoreCard({ score, change = 0, className }: SkinScoreCardProps) {
  const circumference = 2 * Math.PI * 45
  const progress = (score / 100) * circumference
  const strokeDashoffset = circumference - progress

  return (
    <div className={cn("bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(25,28,28,0.04)]", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            Skin Health Score
          </span>
          <h2 className="font-serif text-4xl text-primary">{score}</h2>
          {change !== 0 && (
            <p className={cn(
              "text-sm font-medium",
              change > 0 ? "text-green-600" : "text-red-500"
            )}>
              {change > 0 ? "+" : ""}{change} from last check
            </p>
          )}
        </div>
        
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/50"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-2xl text-primary">{score}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
