"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchLocation } from "@/store/locationSlice"
import { setCurrentAndNext } from "@/store/prayerSlice"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, Calendar, RefreshCw, Bell } from "lucide-react"
import { PRAYER_LABELS, formatCountdown, getCurrentAndNextPrayer } from "@/lib/prayer-utils"
import { cn } from "@/lib/utils"

export function PremiumHomeHero() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { timings, nextPrayer, timeLeft } = useAppSelector((state) => state.prayer)
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
    ? `${PRAYER_LABELS[nextPrayer]} এর জন্য প্রস্তুতি নিন`
    : "আপনার ইবাদত কবুল হোক"

  return (
    <div className="relative w-full overflow-hidden rounded-[3rem] bg-zinc-950 border border-white/5 shadow-2xl min-h-[400px] flex flex-col justify-between">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-accent/15 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-slow" />
      
      {/* Top Section: Greeting & Pills */}
      <div className="relative z-10 px-8 pt-10 md:px-12 md:pt-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2"
          >
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl group transition-all hover:bg-white/10">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{city || "Detecting..."}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(fetchLocation());
                  }}
                  disabled={locLoading}
                  className="hover:scale-110 transition-transform ml-1 p-0.5"
                >
                  <RefreshCw className={cn("h-3 w-3 text-zinc-500", locLoading && "animate-spin")} />
                </button>
             </div>
             
             {hijriDate && (
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                 <Calendar className="h-3 w-3 text-primary" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">{hijriDate} {hijriMonth}</span>
               </div>
             )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-2">
              {greeting}
            </h1>
            <p className="text-sm md:text-base font-bold text-zinc-500 max-w-md">
              {subGreeting}
            </p>
          </motion.div>
        </div>

        {/* Countdown Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative flex flex-col items-center md:items-end gap-2"
        >
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">পরবর্তী নামাজের সময়</div>
          <div className="flex items-baseline gap-1">
             <span className="text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
               {formatCountdown(timeLeft).split(":")[0]}
             </span>
             <span className="text-3xl font-black text-primary animate-pulse mx-1">:</span>
             <span className="text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
               {formatCountdown(timeLeft).split(":")[1]}
             </span>
             <span className="text-3xl font-black text-primary animate-pulse mx-1">:</span>
             <span className="text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
               {formatCountdown(timeLeft).split(":")[2]}
             </span>
          </div>
          {nextPrayer && (
            <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-black text-white uppercase tracking-widest">{PRAYER_LABELS[nextPrayer]} — {timings?.[nextPrayer]}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Section: Actions / Shortcuts */}
      <div className="relative z-10 px-8 pb-10 md:px-12 md:pb-12 flex flex-wrap items-center gap-4 mt-12 md:mt-0">
         <button 
           onClick={() => router.push('/settings')}
           className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 group cursor-pointer"
         >
            <Bell className="h-4 w-4 group-hover:animate-bounce" />
            রিমাইন্ডার সেট করুন
         </button>
         
         <button 
           onClick={() => router.push('/prayers')}
           className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all backdrop-blur-xl cursor-pointer"
         >
            সব সময়ের তালিকা
         </button>

         <div className="flex -space-x-2 ml-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-zinc-950 bg-zinc-900 overflow-hidden ring-1 ring-white/10 flex items-center justify-center">
                 <div className="h-6 w-6 rounded-full bg-primary/20 blur-sm animate-pulse" />
              </div>
            ))}
            <div className="h-10 px-4 rounded-full border-2 border-zinc-950 bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary uppercase tracking-widest ring-1 ring-primary/20">
               +1.2k Joining Now
            </div>
         </div>
      </div>
    </div>
  )
}
