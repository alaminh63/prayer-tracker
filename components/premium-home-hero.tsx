"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchLocation } from "@/store/locationSlice"
import { setCurrentAndNext } from "@/store/prayerSlice"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Clock, MapPin, Calendar, RefreshCw, Bell, Sparkles } from "lucide-react"
import { formatCountdown, getCurrentAndNextPrayer, formatTime12, getTimeDiff } from "@/lib/prayer-utils"
import { cn } from "@/lib/utils"
import { ALLAH_NAMES, AllahName } from "@/lib/allah-names"

const BN_PRAYER_NAMES: Record<string, string> = {
  Fajr: "ফজর",
  Sunrise: "সূর্যোদয়",
  Dhuhr: "যোহর",
  Asr: "আসর",
  Maghrib: "মাগরিব",
  Isha: "এশা",
}

export function PremiumHomeHero() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { timings, nextPrayer, timeLeft } = useAppSelector((state) => state.prayer)
  const [currentName, setCurrentName] = useState<AllahName | null>(null)
  const { city, loading: locLoading } = useAppSelector((state) => state.location)
  const { hijriDate, hijriMonth } = useAppSelector((state) => state.prayer)
  const [mounted, setMounted] = useState(false)

  const updatePrayerInfo = useCallback(() => {
    if (!timings) return
    const info = getCurrentAndNextPrayer(timings)
    dispatch(setCurrentAndNext(info))
  }, [timings, dispatch])

  useEffect(() => {
    setMounted(true)
    // Pick a random name of Allah
    const randomIndex = Math.floor(Math.random() * ALLAH_NAMES.length)
    setCurrentName(ALLAH_NAMES[randomIndex])
  }, [])

  useEffect(() => {
    if (!mounted) return
    updatePrayerInfo()
    const interval = setInterval(updatePrayerInfo, 1000)
    return () => clearInterval(interval)
  }, [mounted, updatePrayerInfo])

  if (!mounted) return null

  const greeting = "আস-সালামু আলাইকুম"
  const subGreeting = nextPrayer 
    ? `${BN_PRAYER_NAMES[nextPrayer] || nextPrayer} এর জন্য প্রস্তুতি নিন`
    : "আপনার ইবাদত কবুল হোক"

  return (
    <div className="relative w-full overflow-hidden rounded-[3rem] bg-card border border-border shadow-2xl min-h-[400px] flex flex-col justify-between">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-accent/15 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-slow" />
      
      {/* Top Section: Greeting & Countdown */}
      <div className="relative z-10 px-8 pt-10 md:px-12 md:pt-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2"
          >
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border backdrop-blur-xl group transition-all hover:bg-secondary/80">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-muted-foreground uppercase  ">{city || "Detecting..."}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(fetchLocation());
                  }}
                  disabled={locLoading}
                  className="hover:scale-110 transition-transform ml-1 p-0.5"
                >
                  <RefreshCw className={cn("h-3 w-3 text-muted-foreground", locLoading && "animate-spin")} />
                </button>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-snug mb-2">
              {greeting}
            </h1>
            <p className="text-sm font-medium text-muted-foreground max-w-md">
              {subGreeting}
            </p>
          </motion.div>
        </div>

        {/* Center content (Desktop only) - Premium Asmaul Husna Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="hidden lg:flex absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center min-w-[340px] text-center pointer-events-none"
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full animate-pulse" />
          
          <div className="relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-card border border-border backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(var(--primary),0.1)] dark:shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] transition-all group pointer-events-auto cursor-pointer"
               onClick={() => {
                 const randomIndex = Math.floor(Math.random() * ALLAH_NAMES.length)
                 setCurrentName(ALLAH_NAMES[randomIndex])
               }}
          >
            {/* Hijri Date Badge */}
            <div className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md flex items-center gap-2 shadow-inner">
              <Calendar className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {hijriDate} {hijriMonth}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {currentName && (
                <motion.div
                  key={currentName.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="w-3 h-3 text-primary/50" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Al-Asma-ul-Husna</span>
                    <Sparkles className="w-3 h-3 text-primary/50" />
                  </div>

                  <div className="text-5xl font-extrabold text-foreground tracking-tighter mb-4 font-arabic leading-tight">
                    {currentName.arabic}
                  </div>
                  
                  <div className="text-lg font-black text-primary tracking-tight mb-1">
                    {currentName.transliteration}
                  </div>
                  
                  <div className="text-sm font-medium text-muted-foreground">
                    {currentName.meaningBn}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interaction hint */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs font-bold text-zinc-600 uppercase ">ট্যাপ করে পরিবর্তন করুন</span>
            </div>
          </div>
        </motion.div>

        {/* Countdown Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative flex flex-col items-center md:items-end gap-1"
        >
          <div className=" font-bold  uppercase  mb-1 text-muted-foreground">পরবর্তী নামাজের সময়</div>
          <div className="flex items-baseline gap-1">
             <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums drop-shadow-xl">
               {formatCountdown(timeLeft).split(":")[0]}
             </span>
             <span className="text-2xl font-bold text-primary animate-pulse mx-1">:</span>
             <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums drop-shadow-xl">
               {formatCountdown(timeLeft).split(":")[1]}
             </span>
             <span className="text-2xl font-bold text-primary animate-pulse mx-1">:</span>
             <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums drop-shadow-xl">
               {formatCountdown(timeLeft).split(":")[2]}
             </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Daily Times (Sehri, Iftar, Next) */}
      <div className="relative z-10 px-8 pb-10 md:px-12 md:pb-12 mt-12 md:mt-auto">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Sehri */}
          {(() => {
            const sehriDiff = timings ? getTimeDiff(timings.Fajr) : 0;
            const isPassed = sehriDiff <= 0;
            return (
              <div className={cn(
                "flex flex-1 min-w-[140px] items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-500",
                isPassed 
                  ? "bg-muted/30 border-border opacity-90" 
                  : "bg-card border-border shadow-sm"
              )}>
                <div className={cn(
                  "h-10 w-10 shrink-0 rounded-full flex items-center justify-center",
                  isPassed ? "bg-zinc-800 text-zinc-500" : "bg-primary/10 text-primary"
                )}>
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">আজকের সেহরি</div>
                  <div className="text-sm font-bold text-foreground tabular-nums">
                    {formatTime12(timings?.Fajr || "")}
                  </div>
                  {!isPassed && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-black text-primary tabular-nums">
                      <div className="h-1 w-1 bg-primary rounded-full animate-pulse" />
                      {formatCountdown(sehriDiff)}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
          
          {/* Iftar */}
          {(() => {
            const iftarDiff = timings ? getTimeDiff(timings.Maghrib) : 0;
            const isPassed = iftarDiff <= 0;
            return (
              <div className={cn(
                "flex flex-1 min-w-[140px] items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-500",
                isPassed 
                  ? "bg-muted/30 border-border opacity-90" 
                  : "bg-card border-border shadow-sm"
              )}>
                <div className={cn(
                  "h-10 w-10 shrink-0 rounded-full flex items-center justify-center",
                  isPassed ? "bg-zinc-800 text-zinc-500" : "bg-emerald-500/10 text-emerald-500"
                )}>
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">আজকের ইফতার</div>
                  <div className="text-sm font-bold text-foreground tabular-nums">
                    {formatTime12(timings?.Maghrib || "")}
                  </div>
                  {!isPassed && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-black text-emerald-500 tabular-nums">
                      <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                      {formatCountdown(iftarDiff)}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Next Salat */}
          {nextPrayer && (
          <div className="flex flex-1 min-w-[160px] items-center gap-3 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md hover:bg-primary/20 transition-colors cursor-default">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="  font-medium text-primary uppercase  ">পরবর্তী নামাজ</div>
              <div className="text-sm font-bold text-foreground">{BN_PRAYER_NAMES[nextPrayer] || nextPrayer} — {formatTime12(timings?.[nextPrayer] || "")}</div>
            </div>
          </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
