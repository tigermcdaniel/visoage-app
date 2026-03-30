"use client"

import { cn } from "@/lib/utils"

interface ProgressSparklineProps {
  title: string
  value: number
  data: number[]
  unit?: string
  className?: string
}

export function ProgressSparkline({ 
  title, 
  value, 
  data, 
  unit = "%",
  className 
}: ProgressSparklineProps) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  
  return (
    <div className={cn("bg-surface-container-low p-5 rounded-[1.5rem] space-y-3", className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            {title}
          </span>
          <p className="font-serif text-2xl text-primary">
            {value}{unit}
          </p>
        </div>
      </div>
      
      <div className="flex items-end gap-1 h-12">
        {data.map((point, i) => {
          const height = ((point - minValue) / range) * 100
          const isLast = i === data.length - 1
          
          return (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-t-sm transition-all",
                isLast ? "bg-primary" : "bg-primary/30"
              )}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
