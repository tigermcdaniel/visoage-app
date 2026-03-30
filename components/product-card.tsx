"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  name: string
  brand: string
  category: string
  image: string
  status: "full" | "half" | "low" | "empty"
  onClick?: () => void
}

const statusConfig = {
  full: { label: "Full", color: "bg-green-500", width: "100%" },
  half: { label: "Half", color: "bg-yellow-500", width: "50%" },
  low: { label: "Running Low", color: "bg-orange-500", width: "25%" },
  empty: { label: "Empty", color: "bg-red-500", width: "5%" },
}

export function ProductCard({ name, brand, category, image, status, onClick }: ProductCardProps) {
  const statusInfo = statusConfig[status]
  const isLow = status === "low" || status === "empty"
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(25,28,28,0.04)] transition-all active:scale-[0.98] text-left",
        isLow && "ring-2 ring-orange-200"
      )}
    >
      <div className="aspect-square relative bg-surface-container">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        {isLow && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </div>
      
      <div className="p-3 space-y-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            {category}
          </p>
          <p className="font-medium text-foreground text-sm line-clamp-1">{name}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{brand}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground">{statusInfo.label}</span>
          </div>
          <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", statusInfo.color)}
              style={{ width: statusInfo.width }}
            />
          </div>
        </div>
      </div>
    </button>
  )
}
