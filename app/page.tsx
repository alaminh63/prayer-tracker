"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { CountdownRing } from "@/components/countdown-ring"
import { SehriIftarHero } from "@/components/sehri-iftar-hero"
import { PrayerList } from "@/components/prayer-list"
import { DailyReminder } from "@/components/daily-reminder"

export default function HomePage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Assalamu Alaikum</span>} 
        subtitle="May your prayers be accepted" 
      />

      <div className="px-4 lg:px-8">
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Daily Dynamic Reminder */}
          <DailyReminder />
          {/* Countdown Hero - Desktop: Side by side, Mobile: Stacked */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Countdown Ring */}
            <section
              aria-label="Prayer countdown"
              className="flex-1 flex justify-center rounded-2xl glass-card-strong p-6 lg:p-8"
            >
              <CountdownRing />
            </section>

            {/* Sehri/Iftar on desktop sits beside the ring */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 gap-4">
              <SehriIftarHero />
              {/* Quick Info */}
              <div className="glass-card rounded-2xl p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
                  Ramadan Reminder
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {"\"The month of Ramadan in which was revealed the Quran, a guidance for mankind.\""}
                </p>
                <p className="text-xs text-primary mt-2 font-serif">
                  Al-Baqarah 2:185
                </p>
              </div>
            </div>
          </div>

          {/* Sehri/Iftar - Mobile only */}
          <section aria-label="Sehri and Iftar times" className="lg:hidden">
            <SehriIftarHero />
          </section>

          {/* Prayer Times */}
          <section aria-label="Today's prayer times">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground lg:text-lg">
                {"Today's Prayers"}
              </h2>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                5 Waqt Salah
              </span>
            </div>
            <PrayerList />
          </section>

          {/* Quran reminder - Mobile only */}
          <section className="lg:hidden glass-card rounded-2xl p-5 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">
              Daily Reminder
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {"\"Indeed, prayer prohibits immorality and wrongdoing.\""}
            </p>
            <p className="text-xs text-primary mt-2 font-serif">
              Al-Ankabut 29:45
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
