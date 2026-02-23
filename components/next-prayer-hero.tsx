"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import { parseTimeString, formatTime12, type PrayerName } from "@/lib/prayer-utils"
import { motion } from "framer-motion"
import { Clock, Bell, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export function NextPrayerHero() {
  const timings = useAppSelector((state) => state.prayer.timings)
  const nextPrayer = useAppSelector((state) => state.prayer.nextPrayer)
  const currentPrayer = useAppSelector((state) => state.prayer.currentPrayer)
  const city = useAppSelector((state) => state.location.city)
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    if (!timings || !nextPrayer) return

    const timer = setInterval(() => {
      const nextTime = parseTimeString(timings[nextPrayer])
      const now = new Date()
      const diff = nextTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("00:00:00")
        return
      }

      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [timings, nextPrayer])

  if (!timings || !nextPrayer) return null

  const nextTimeStr = timings[nextPrayer]

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/20" />
      <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-accent/20 blur-[120px] rounded-full animate-pulse-slow" />
      
      <div className="relative px-5 py-5 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center md:justify-start gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto md:mx-0"
          >
            <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
            <span className="text-[11px] font-black text-primary uppercase">
              {t.prayers[nextPrayer.toLowerCase() as keyof typeof t.prayers]} {t.common.running}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tighter mb-0.5">
              {t.prayers[nextPrayer.toLowerCase() as keyof typeof t.prayers]}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="flex items-center gap-1 text-zinc-500">
                <Clock className="h-3 w-3" />
                <span className="text-sm font-bold">{formatTime12(nextTimeStr)}</span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-border" />
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="text-[11px] font-bold uppercase">{city || "Dhaka"}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-2.5 mt-1">
             <button className="px-4 py-2 rounded-lg bg-primary text-white font-black text-xs uppercase hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-1.5 group">
                <Bell className="h-3 w-3 group-hover:animate-bounce" />
                {t.common.reminder}
             </button>
             <button className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                <Clock className="h-3.5 w-3.5" />
             </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative"
        >
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-muted flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 blur-3xl scale-110 group-hover:scale-125 transition-transform" />
            <div className="text-center relative z-10">
              <p className="text-[11px] font-black text-primary uppercase mb-0.5">{t.common.remaining}</p>
              <div className="text-xl md:text-3xl font-black text-foreground dark:text-white tabular-nums tracking-tighter">
                {timeLeft || "00:00:00"}
              </div>
            </div>
          </div>

          {/* Floating Accents */}
          <div className="absolute top-0 right-0 h-10 w-10 bg-accent/20 blur-lg rounded-full" />
          <div className="absolute bottom-4 -left-2 h-6 w-6 bg-primary/20 blur-lg rounded-full" />
        </motion.div>
      </div>

      {/* Simplified Footer Info */}
      <div className="relative px-5 py-3 border-t border-border bg-muted/30 flex flex-col md:flex-row items-center justify-between gap-2">
         <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-accent/10 flex items-center justify-center text-accent">
               <MapPin size={10} />
            </div>
            <p className="text-[11px] text-muted-foreground font-bold uppercase">{t.common.location_schedule} <span className="text-foreground dark:text-white">{city || "Location"}</span></p>
         </div>
          <p className="text-[11px] text-muted-foreground font-black uppercase hidden md:block">{t.common.next}: {t.prayers[nextPrayer.toLowerCase() as keyof typeof t.prayers]} • {t.common.today}: {currentPrayer ? t.prayers[currentPrayer.toLowerCase() as keyof typeof t.prayers] : "---"}</p>
      </div>
    </div>
  )
}
