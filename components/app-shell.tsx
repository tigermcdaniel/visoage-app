"use client"

import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"

interface AppShellProps {
  children: React.ReactNode
  showHeader?: boolean
  showProfile?: boolean
}

export function AppShell({ 
  children, 
  showHeader = true,
  showProfile = true 
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header showProfile={showProfile} />}
      <main className={`${showHeader ? 'pt-24' : ''} pb-32 px-6 max-w-lg mx-auto`}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
