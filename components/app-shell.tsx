"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Clock, Bell, Settings, Compass, Calendar, Calculator, Hand, BookOpen, Heart, Activity, SunMoon, Coins, Bookmark, History as HistoryIcon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { LocationInitializer } from "@/components/location-initializer"
import { useServiceWorker } from "@/hooks/use-service-worker"
import { useTranslation } from "@/hooks/use-translation"
import { GlobalAudioPlayer } from "@/components/quran/global-audio-player"
import { AdhanPlayer } from "@/components/adhan-player"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { LocationSoftPrompt } from "@/components/location-soft-prompt"
import { BottomNav } from "@/components/bottom-nav"

const navItems = [
  { href: "/", icon: Home, label: "Home", translationKey: "home" },
  { href: "/prayers", icon: Clock, label: "Prayers", translationKey: "prayers" },
  { href: "/tracker", icon: Activity, label: "Tracker", translationKey: "tracker" },
  { href: "/calendar", icon: Calendar, label: "Calendar", translationKey: "calendar" },
  { href: "/qibla", icon: Compass, label: "Qibla", translationKey: "qibla" },
  { href: "/deen", icon: Heart, label: "Deen Hub", translationKey: "deen" },
  { href: "/calculators", icon: Calculator, label: "Calculators", translationKey: "calculators" },
  { href: "/quran", icon: BookOpen, label: "Quran", translationKey: "quran" },
  { href: "/hadith", icon: BookOpen, label: "Hadith", translationKey: "hadith" },
  { href: "/quran/bookmarks", icon: Bookmark, label: "Bookmarks", translationKey: "bookmarks" },
  { href: "/quran/history", icon: HistoryIcon, label: "History", translationKey: "history" },
  { href: "/settings", icon: Settings, label: "Settings", translationKey: "settings" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  useServiceWorker()
  const pathname = usePathname()
  const { t, language } = useTranslation()

  const translatedNavItems = navItems.map(item => ({
    ...item,
    label: t.nav[item.translationKey as keyof typeof t.nav] || item.label
  }))

  return (
    <div className="flex min-h-screen bg-background">
      <LocationInitializer />
      <LocationSoftPrompt />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card/50">
        <div className="flex flex-col flex-1 px-4 pt-8 pb-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 overflow-hidden p-1">
              <Image
                src="/logo.png"
                alt="CloudGen Logo"
                width={32}
                height={32}
                className="object-contain dark:invert"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">CloudGen</h1>
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
            <Link 
              href="https://cloudgen.bd" 
              target="_blank" 
              className="block rounded-xl border border-border bg-secondary/40 p-4 hover:bg-secondary/60 transition-colors group"
            >
              <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors">CloudGen</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Build by CloudGen.bd
              </p>
            </Link>
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
      <BottomNav />

      <GlobalAudioPlayer />
      <AdhanPlayer />
      <PWAInstallPrompt />
    </div>
  )
}
