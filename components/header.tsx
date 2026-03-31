"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeaderProps {
  showProfile?: boolean
}

export function Header({ showProfile = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-card/70 backdrop-blur-2xl shadow-[0px_20px_40px_rgba(25,28,28,0.06)] safe-top">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          {showProfile && (
            <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="font-serif italic text-2xl text-primary">
            VisoAge
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
