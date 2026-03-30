"use client"

import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CheckInCountdownProps {
  daysUntilCheckIn: number
}

export function CheckInCountdown({ daysUntilCheckIn }: CheckInCountdownProps) {
  const isReady = daysUntilCheckIn <= 0

  return (
    <div className="bg-primary-fixed p-6 rounded-[1.5rem] space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] uppercase tracking-widest text-primary/60 font-bold">
            Next Check-In
          </span>
          {isReady ? (
            <p className="font-serif text-2xl text-primary">Ready Now</p>
          ) : (
            <p className="font-serif text-2xl text-primary">
              {daysUntilCheckIn} day{daysUntilCheckIn !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-8 rounded-full transition-all ${
                i < 7 - daysUntilCheckIn
                  ? "bg-primary"
                  : "bg-primary/20"
              }`}
            />
          ))}
        </div>
      </div>
      
      {isReady && (
        <Link href="/analyze">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
            <Camera className="mr-2 h-4 w-4" />
            Take Photo Analysis
          </Button>
        </Link>
      )}
    </div>
  )
}
