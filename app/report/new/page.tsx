"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewReportPage() {
  const router = useRouter()
  
  // Redirect to the latest report (simulated as 085)
  useEffect(() => {
    router.replace("/report/085")
  }, [router])
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading report...</div>
    </div>
  )
}
