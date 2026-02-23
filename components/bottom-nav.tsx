"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Clock, Settings, Bell, LayoutGrid, Activity, Calendar, Compass, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", icon: Home, key: "home" },
  { href: "/prayers", icon: Clock, key: "prayers" },
  { href: "/quran", icon: BookOpen, key: "quran" },
  { href: "/tracker", icon: Activity, key: "tracker" },
  { href: "/calendar", icon: Calendar, key: "calendar" },
  { href: "/qibla", icon: Compass, key: "qibla" },
  { href: "/deen", icon: LayoutGrid, key: "deen" },
  { href: "/notifications", icon: Bell, key: "alerts" },
  { href: "/settings", icon: Settings, key: "settings" },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const handleHaptic = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(10)
    }
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:hidden pointer-events-none">
      <nav
        className="mx-auto max-w-[95%] rounded-[2rem] bg-black/80 backdrop-blur-3xl border border-white/20 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.8)] pointer-events-auto overflow-hidden"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-2 py-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleHaptic}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-5 transition-all duration-300 rounded-2xl min-w-[80px] snap-center",
                  isActive ? "text-primary bg-white/10" : "text-zinc-400 hover:text-zinc-200"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon 
                  className={cn(
                    "h-5 w-5 mb-1 relative z-10 transition-transform duration-300",
                    isActive ? "stroke-[2.5px] scale-110" : "stroke-[2px]"
                  )} 
                  aria-hidden="true" 
                />
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider relative z-10 whitespace-nowrap transition-colors duration-300",
                  isActive ? "text-primary" : "text-zinc-400"
                )}>
                  {t.nav[item.key as keyof typeof t.nav]}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-1.5 h-0.5 w-4 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
