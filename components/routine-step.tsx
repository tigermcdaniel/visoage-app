"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface RoutineStepProps {
  step: number
  name: string
  product?: string
  productImage?: string
  duration?: string
  done: boolean
  onToggle: () => void
}

export function RoutineStep({ 
  step, 
  name, 
  product, 
  productImage,
  duration,
  done, 
  onToggle 
}: RoutineStepProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98]",
        done 
          ? "bg-primary/10" 
          : "bg-surface-container-lowest shadow-[0px_4px_20px_rgba(25,28,28,0.04)]"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0",
        done 
          ? "bg-primary text-primary-foreground" 
          : "bg-surface-container text-muted-foreground"
      )}>
        {done ? <Check className="h-5 w-5" /> : step}
      </div>
      
      {productImage && (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container shrink-0">
          <Image
            src={productImage}
            alt={product || name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1 text-left">
        <p className={cn(
          "font-medium transition-all",
          done ? "text-primary line-through opacity-60" : "text-foreground"
        )}>
          {name}
        </p>
        {product && (
          <p className="text-sm text-muted-foreground">{product}</p>
        )}
      </div>
      
      {duration && (
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
          {duration}
        </span>
      )}
    </button>
  )
}
