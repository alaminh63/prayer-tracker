"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Clock, Bell, Settings, Compass, Calendar, Calculator, Hand, BookOpen, Heart, Activity, SunMoon, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { LocationInitializer } from "@/components/location-initializer"
import { useServiceWorker } from "@/hooks/use-service-worker"
import { useTranslation } from "@/hooks/use-translation"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/prayers", icon: Clock, label: "Prayers" },
  { href: "/tracker", icon: Activity, label: "Tracker" },
  { href: "/qibla", icon: Compass, label: "Qibla" },
  { href: "/tasbih", icon: Hand, label: "Tasbih" },
  { href: "/azkar", icon: SunMoon, label: "Azkar" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/zakat", icon: Calculator, label: "Zakat" },
  { href: "/fitra", icon: Coins, label: "Fitra" },
  { href: "/names", icon: BookOpen, label: "99 Names" },
  { href: "/duas", icon: Heart, label: "Duas" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  useServiceWorker()
  const pathname = usePathname()
  const { t, language } = useTranslation()

  const translatedNavItems = navItems.map(item => {
    const key = item.href === "/" ? "home" : item.href.replace("/", "") as keyof typeof t.nav
    return {
      ...item,
      label: t.nav[key] || item.label
    }
  })

  return (
    <div className="flex min-h-screen bg-background">
      <LocationInitializer />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card/50">
        <div className="flex flex-col flex-1 px-4 pt-8 pb-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              >
                <path d="M12 2C8 6 4 10 4 14v6a2 2 0 002 2h12a2 2 0 002-2v-6c0-4-4-8-8-12z" />
                <path d="M12 22v-6" />
                <path d="M9 22v-3a3 3 0 016 0v3" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Salat Time</h1>
              <p className="text-[11px] text-muted-foreground">
                {language === "bn" ? "প্রার্থনার সময় এবং অনুস্মারক" : "Prayer Times & Reminders"}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
            {translatedNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Info */}
          <div className="mt-auto px-3">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs font-medium text-foreground">Salat Time v2.0</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Powered by Aladhan API
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        <div className="min-h-screen pb-20 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-card/90 backdrop-blur-xl"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center gap-1 py-1 px-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory">
          {translatedNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 min-w-[72px] py-1.5 rounded-xl transition-all relative snap-center",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
                )}
                <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_oklch(0.80_0.13_85/0.5)]")} aria-hidden="true" />
                <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            )
          })}
        </div>
        {/* Safe area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
