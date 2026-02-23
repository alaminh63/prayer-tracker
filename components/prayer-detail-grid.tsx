"use client"

import { useAppSelector } from "@/store/hooks"
import {
  PRAYER_NAMES,
  PRAYER_ARABIC,
  parseTimeString,
  formatTime12,
  type PrayerName,
} from "@/lib/prayer-utils"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Sunrise, Clock, Bell, BellOff } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export function PrayerDetailGrid() {
  const timings = useAppSelector((state) => state.prayer.timings)
  const currentPrayer = useAppSelector((state) => state.prayer.currentPrayer)
  const nextPrayer = useAppSelector((state) => state.prayer.nextPrayer)
  const loading = useAppSelector((state) => state.prayer.loading)
  const { t } = useTranslation()

  if (loading || !timings) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 rounded-3xl bg-muted animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  const prayers: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
  
  const allItems = prayers.map(name => ({
    name,
    label: t.prayers[name.toLowerCase() as keyof typeof t.prayers],
    arabic: PRAYER_ARABIC[name],
    time: timings[name],
    isNext: nextPrayer === name,
    isCurrent: currentPrayer === name,
    isSunrise: false
  }))

  const sunriseIdx = allItems.findIndex(p => p.name === "Fajr") + 1
  allItems.splice(sunriseIdx, 0, {
    name: "Sunrise" as any,
    label: t.prayers.sunrise,
    arabic: "شروق",
    time: timings.Sunrise,
    isNext: false,
    isCurrent: false,
    isSunrise: true
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {allItems.map((prayer, index) => {
        const timeDate = parseTimeString(prayer.time)
        const isPast = new Date() > timeDate && !prayer.isCurrent

        return (
          <motion.div
            key={prayer.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "group relative overflow-hidden p-6 rounded-4xl border transition-all duration-500",
              prayer.isNext 
                ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/10 scale-[1.02] ring-1 ring-primary/20" 
                : prayer.isCurrent
                  ? "bg-accent/10 border-accent/30 shadow-xl shadow-accent/5 ring-1 ring-accent/20"
                  : isPast
                    ? "bg-muted/50 border-border opacity-70 grayscale-[0.3]"
                    : "bg-card border-border hover:bg-muted/50"
            )}
          >
            {/* Background Accent */}
            <div className={cn(
              "absolute top-0 right-0 h-32 w-32 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity",
              prayer.isNext ? "bg-primary" : prayer.isCurrent ? "bg-accent" : "bg-white"
            )} />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500",
                  prayer.isNext 
                    ? "bg-primary/20 border-primary/40 text-primary rotate-3 group-hover:rotate-6" 
                    : prayer.isCurrent
                        ? "bg-accent/20 border-accent/40 text-accent"
                        : "bg-muted/50 border-border text-muted-foreground"
                )}>
                  {prayer.isSunrise ? <Sunrise size={24} /> : <div className="p-1"><Clock size={20} /></div>}
                </div>
                
                <div>
                  <h3 className={cn(
                    "text-lg font-black tracking-tight",
                    prayer.isNext ? "text-primary" : prayer.isCurrent ? "text-accent" : "text-foreground dark:text-white"
                  )}>
                    {prayer.label}
                  </h3>
                  <p className="text-xs text-muted-foreground font-black uppercase mt-0.5">
                    {prayer.arabic}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className={cn(
                  "text-3xl font-black tabular-nums tracking-tighter",
                  prayer.isNext ? "text-primary shadow-glow-gold" : "text-foreground dark:text-white"
                )}>
                  {formatTime12(prayer.time)}
                </div>
              </div>
            </div>

            {/* Icons / Status Footer */}
            <div className="mt-6 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 {prayer.isNext && (
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-black uppercase flex items-center gap-1.5 shadow-lg shadow-primary/20">
                     <Clock size={12} className="animate-spin-slow" />
                     {t.common.next}
                   </span>
                 )}
                 {prayer.isCurrent && (
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-black uppercase flex items-center gap-2 border border-accent/30 shadow-lg shadow-accent/20">
                     <div className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                     {t.common.running}
                   </span>
                 )}
               </div>

               <button className={cn(
                 "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                 prayer.isNext || prayer.isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
               )}>
                 <Bell size={18} />
               </button>
            </div>

            {/* Glowing stripe for current/next */}
            {(prayer.isNext || prayer.isCurrent) && (
              <div className={cn(
                "absolute top-0 left-0 w-full h-1",
                prayer.isNext ? "bg-primary" : "bg-accent"
              )} />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
