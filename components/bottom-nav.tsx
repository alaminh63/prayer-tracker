"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Clock, Settings, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/prayers", icon: Clock, label: "Prayers" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-card-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
