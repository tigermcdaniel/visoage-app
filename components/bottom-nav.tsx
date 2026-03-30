"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sparkles, Briefcase, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/routine", icon: Sparkles, label: "Routine" },
  { href: "/cabinet", icon: Briefcase, label: "Cabinet" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-3xl rounded-t-3xl shadow-[0px_-10px_30px_rgba(25,28,28,0.04)] safe-bottom">
      <div className="flex justify-around items-center px-4 pt-3 pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300",
                isActive
                  ? "text-primary bg-primary/10 rounded-xl px-4 py-1"
                  : "text-muted-foreground/40 hover:text-primary"
              )}
            >
              <Icon 
                className="mb-1 h-6 w-6" 
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
