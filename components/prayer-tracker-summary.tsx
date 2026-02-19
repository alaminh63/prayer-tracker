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
    <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950/40 p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group ring-1 ring-white/5">
      {/* Background Decor */}
      <div className="absolute -right-8 -top-8 opacity-5 text-primary group-hover:opacity-10 transition-opacity duration-700">
        <Star size={180} />
      </div>

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20">
            <Activity size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">দৈনিক আমল</h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-0.5">আজকের প্রগ্রেস ড্যাশবোর্ড</p>
          </div>
        </div>
        <Link href="/tracker">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-white/10 transition-all">
            বিস্তারিত <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Salat Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">৫ ওয়াক্ত সালাত</span>
            <span className="text-xl font-black text-primary tracking-tighter">{completedSalat}/৫</span>
          </div>
          <div className="flex items-center gap-2.5 h-3">
            {PRAYER_IDS.map((id) => (
              <div 
                key={id}
                className={cn(
                  "h-full flex-1 rounded-full transition-all duration-700 relative overflow-hidden",
                  data.salat?.[id] 
                    ? "bg-primary shadow-[0_0_20px_rgba(255,107,0,0.4)] scale-y-125" 
                    : "bg-white/5"
                )}
              >
                {data.salat?.[id] && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Amals Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "সকাল", val: completedMorning, total: 3 },
            { label: "বিকাল", val: completedEvening, total: 3 },
            { label: "রাত", val: completedNight, total: 3 }
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-[1.5rem] bg-white/5 border border-white/5 text-center backdrop-blur-sm group/item hover:bg-white/10 transition-colors">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 group-hover/item:text-zinc-300 transition-colors">{item.label}</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-2xl font-black text-white tracking-tighter">{item.val}</span>
                <span className="text-[10px] font-bold text-zinc-600">/{item.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {completedSalat === 5 && totalAmols > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 flex items-center gap-4 p-5 rounded-4xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-xl shadow-emerald-500/5"
          >
            <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center shadow-inner">
              <Trophy size={24} className="animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-tight">মাশা-আল্লাহ!</p>
              <p className="text-[11px] font-bold opacity-70">আপনার আমলগুলো কবুল হোক।</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
