"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewReportPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if we have fresh analysis data from /analyze
    const raw = sessionStorage.getItem("visoage_analysis")
    if (raw) {
      // Use timestamp-based ID for the live report
      const data = JSON.parse(raw)
      const ts = data.analyzedAt
        ? new Date(data.analyzedAt).getTime().toString().slice(-6)
        : Date.now().toString().slice(-6)
      router.replace(`/report/${ts}`)
    } else {
      // Fall back to the demo report
      router.replace("/report/085")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading report...</div>
    </div>
  )
}
