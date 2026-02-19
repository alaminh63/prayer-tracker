"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { CountdownRing } from "@/components/countdown-ring"
import { SehriIftarHero } from "@/components/sehri-iftar-hero"
import { PrayerList } from "@/components/prayer-list"
import { DailyReminder } from "@/components/daily-reminder"
import { HadithCard } from "@/components/hadith-card"
import { RamadanStatus } from "@/components/ramadan-status"
import { PrayerTrackerSummary } from "@/components/prayer-tracker-summary"
import { Clock } from "lucide-react"

export default function HomePage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Assalamu Alaikum</span>} 
        subtitle="May your prayers be accepted" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Main Content Area (Left/Center) */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            {/* Daily Dynamic Reminder */}
            <DailyReminder />
            
            {/* Countdown Hero */}
            <section
              aria-label="Prayer countdown"
              className="flex justify-center rounded-[2.5rem] glass-card-strong p-6 lg:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50" />
              <div className="relative z-10 w-full">
                <CountdownRing />
              </div>
            </section>

            {/* Prayer Times Section */}
            <section aria-label="Today's prayer times" className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Prayers
                </h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Live Updates
                  </span>
                </div>
              </div>
              <div className="bg-zinc-900/30 rounded-[2.5rem] p-2 border border-white/5">
                <PrayerList />
              </div>
            </section>
          </div>

          {/* Sidebar / Secondary Content (Right) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 sticky top-24">
            <RamadanStatus />
            <PrayerTrackerSummary />
            <HadithCard />
            <SehriIftarHero />
            
            {/* Quick Links / Stats could go here later */}
            <div className="rounded-[2.5rem] bg-linear-to-br from-primary/20 to-primary/5 p-6 border border-primary/20">
              <h4 className="text-sm font-bold text-white mb-2">Did you know?</h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                Sajdah is the closest a servant gets to their Lord. Make plenty of Dua in prostration.
              </p>
            </div>
          </aside>
          
        </div>
      </div>
    </AppShell>
  )
}
