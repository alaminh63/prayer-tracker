"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Trophy, Activity, ArrowRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const PRAYER_IDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"]

export function PrayerTrackerSummary() {
  const [data, setData] = useState<any>({ salat: {}, morning: {}, evening: {}, night: {} })
  const [loading, setLoading] = useState(true)
  const date = new Date().toISOString().split("T")[0]

  useEffect(() => {
    async function fetchTracking() {
      try {
        const res = await fetch(`/api/prayers/track?date=${date}`)
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch tracking summary:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTracking()
  }, [date])

  const completedSalat = Object.values(data.salat || {}).filter(v => v).length
  const completedMorning = Object.values(data.morning || {}).filter(v => v).length
  const completedEvening = Object.values(data.evening || {}).filter(v => v).length
  const completedNight = Object.values(data.night || {}).filter(v => v).length
  
  const totalAmols = completedMorning + completedEvening + completedNight
  const salatProgress = (completedSalat / 5) * 100

  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950/40 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute -right-4 -top-4 opacity-5 text-primary group-hover:opacity-10 transition-opacity">
        <Star size={120} />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">দৈনিক আমল</h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">আজকের প্রগ্রেস</p>
          </div>
        </div>
        <Link href="/tracker">
          <button className="flex items-center gap-1 text-[10px] font-black uppercase text-primary hover:gap-2 transition-all">
            বিস্তারিত <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Salat Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">৫ ওয়াক্ত সালাত</span>
            <span className="text-sm font-black text-primary">{completedSalat}/৫</span>
          </div>
          <div className="flex items-center gap-2 h-2.5">
            {PRAYER_IDS.map((id) => (
              <div 
                key={id}
                className={cn(
                  "h-full flex-1 rounded-full transition-all duration-700",
                  data.salat?.[id] 
                    ? "bg-primary shadow-[0_0_15px_rgba(255,107,0,0.5)] scale-y-110" 
                    : "bg-white/5"
                )}
              />
            ))}
          </div>
        </div>

        {/* Amals Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">সকাল</p>
            <span className="text-lg font-black text-white">{completedMorning}/৩</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">বিকাল</p>
            <span className="text-lg font-black text-white">{completedEvening}/৩</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">রাত</p>
            <span className="text-lg font-black text-white">{completedNight}/৩</span>
          </div>
        </div>
      </div>
      
      {completedSalat === 5 && totalAmols > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex items-center gap-4 p-4 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-lg"
        >
          <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-tighter">মাশা-আল্লাহ!</p>
            <p className="text-[10px] font-bold opacity-80">আপনার আমলগুলো কবুল হোক।</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
