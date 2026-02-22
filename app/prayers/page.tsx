"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { NextPrayerHero } from "@/components/next-prayer-hero"
import { PrayerDetailGrid } from "@/components/prayer-detail-grid"
import { PrayerMonthlyCalendar } from "@/components/prayer-monthly-calendar"
import { PageHeader } from "@/components/page-header"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export default function PrayersPage() {
  const { t } = useTranslation()
  const [view, setView] = useState<"daily" | "monthly">("daily")

  return (
    <AppShell>
      <div className="flex flex-col gap-10 w-full mx-auto px-4 lg:px-8 pb-20 pt-6">
        {/* Page Header */}
        <PageHeader 
          title={t.prayers.title}
          subtitle={t.prayers.subtitle}
        />

        {/* Next Prayer Hero */}
        <NextPrayerHero />

        <div className="flex flex-col gap-8">
          {/* Section Header & Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
            <div>
              <h2 className="text-3xl font-black text-foreground dark:text-white tracking-tight">{t.prayers.all_prayers}</h2>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Detailed view of all prayer timings</p>
            </div>

            <div className="flex p-1.5 bg-secondary rounded-2xl border border-border backdrop-blur-xl">
               <button 
                onClick={() => setView("daily")}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  view === "daily" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                )}
               >
                 <LayoutGrid size={16} />
                 {t.prayers.daily}
               </button>
               <button 
                onClick={() => setView("monthly")}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  view === "monthly" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                )}
               >
                 <Calendar size={16} />
                 {t.prayers.monthly}
               </button>
            </div>
          </div>

          {/* Conditional Content with Animation */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {view === "daily" ? (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PrayerDetailGrid />
                </motion.div>
              ) : (
                <motion.div
                  key="monthly"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-card border border-border rounded-4xl p-2 md:p-6 backdrop-blur-xl">
                    <PrayerMonthlyCalendar />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info / Quote */}
        <div className="mt-8 p-12 text-center rounded-[3rem] bg-card border border-dashed border-border relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 group-hover:scale-125 transition-transform opacity-30" />
           <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                 <LayoutGrid size={32} />
              </div>
              <p className="text-xl md:text-3xl font-black text-foreground dark:text-white italic tracking-tighter max-w-2xl leading-tight">
                "{t.common.tracker_verse}"
              </p>
              <div className="h-px w-24 bg-primary/30" />
              <p className="text-sm font-black text-primary uppercase tracking-[0.3em]">{t.common.tracker_source}</p>
           </div>
        </div>
      </div>
    </AppShell>
  )
}
