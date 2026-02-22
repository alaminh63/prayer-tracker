"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Activity, ArrowRight, Star, Heart, Cloud, ShieldCheck, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAppSelector } from "@/store/hooks"

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
  
  const totalSalatTarget = 5
  const totalAmolsTarget = 9 // 3 morning, 3 evening, 3 night
  const totalCompleted = completedSalat + completedMorning + completedEvening + completedNight
  const totalTarget = totalSalatTarget + totalAmolsTarget
  
  const overallProgress = Math.round((totalCompleted / totalTarget) * 100)


  return (
    <div className="rounded-[2.5rem] border border-border bg-card p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group space-y-10">
      {/* Background Decor */}
      <div className="absolute -right-12 -top-12 opacity-5 text-primary group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
        <Star size={240} fill="currentColor" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">দৈনিক আমল</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-muted-foreground">প্রগ্রেস ড্যাশবোর্ড</p>
          </div>
        </div>
        <Link href="/tracker">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-[11px] font-black uppercase text-primary hover:bg-primary/10 hover:border-primary/20 transition-all active:scale-95 group/btn">
            বিস্তারিত 
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Top Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Salat Progress Card */}
          <div className="md:col-span-7 p-7 rounded-[2.5rem] bg-card border border-border relative overflow-hidden group/salat shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Heart className="h-4 w-4 text-primary fill-primary" />
                </div>
                <p className="font-black uppercase text-xs tracking-widest text-zinc-400">৫ ওয়াক্ত সালাত</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-foreground tracking-tighter">{completedSalat}</span>
                <span className="text-sm font-bold text-muted-foreground">/৫</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 h-3">
              {PRAYER_IDS.map((id) => (
                <div 
                  key={id}
                  className={cn(
                    "h-full flex-1 rounded-full transition-all duration-1000 relative overflow-hidden",
                    data.salat?.[id] 
                      ? "bg-primary shadow-[0_0_20px_rgba(255,107,0,0.4)]" 
                      : "bg-muted"
                  )}
                >
                  {data.salat?.[id] && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-white/20 animate-pulse" 
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between">
              <p className="text-[10px] font-black uppercase text-muted-foreground">সালাত প্রগ্রেস</p>
              <p className="text-[10px] font-black text-primary uppercase">{(completedSalat / 5) * 100}% Complete</p>
            </div>

            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover/salat:bg-primary/10 transition-colors" />
          </div>

          {/* Daily Score Circle Card */}
          <div className="md:col-span-5 p-7 rounded-[2.5rem] bg-card border border-border flex items-center justify-between relative overflow-hidden group/score shadow-sm">
            <div className="space-y-2">
               <p className="font-black uppercase text-xs tracking-widest text-muted-foreground">আজকের স্কোর</p>
               <p className="text-5xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-lg">{overallProgress}%</p>
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 w-fit">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Live Status</span>
               </div>
            </div>
            <div className="relative h-20 w-20">
               <svg className="h-full w-full -rotate-90">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/10 dark:text-white/5" />
                  <motion.circle 
                    cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="8" 
                    className="text-primary"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 36}
                    initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 36) * (1 - overallProgress/100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy size={20} className="text-primary drop-shadow-glow" />
               </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
          </div>
        </div>

        {/* Amals Detailed Grid */}
        <div className="grid grid-cols-3 gap-5">
          {[
            { 
              label: "সকাল", 
              val: completedMorning, 
              total: 3, 
              icon: Cloud, 
              color: "from-sky-500/20 to-sky-500/5 hover:from-sky-500/30",
              accent: "text-sky-400",
              ring: "ring-sky-500/20"
            },
            { 
              label: "বিকাল", 
              val: completedEvening, 
              total: 3, 
              icon: Sun, 
              color: "from-amber-500/20 to-amber-500/5 hover:from-amber-500/30",
              accent: "text-amber-400",
              ring: "ring-amber-500/20"
            },
            { 
              label: "রাত", 
              val: completedNight, 
              total: 3, 
              icon: Moon, 
              color: "from-indigo-500/20 to-indigo-500/5 hover:from-indigo-500/30",
              accent: "text-indigo-400",
              ring: "ring-indigo-500/20"
            }
          ].map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "group/item p-6 rounded-[2.2rem] bg-linear-to-b border border-border flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:-translate-y-2 shadow-sm",
                item.color,
                item.ring
              )}
            >
              <div className={cn("p-2.5 rounded-xl bg-muted/50 shadow-inner transition-transform group-hover/item:scale-110 duration-500", item.accent)}>
                <item.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-black text-[11px] uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors">
                  {item.label}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-black text-foreground tracking-tighter tabular-nums">{item.val}</span>
                  <span className="text-xs font-bold text-muted-foreground ml-0.5">/{item.total}</span>
                </div>
              </div>
              {/* Progress dots */}
              <div className="flex gap-1.5 h-1 w-10">
                {Array.from({ length: item.total }).map((_, dotIndex) => (
                  <div 
                    key={dotIndex}
                    className={cn(
                      "h-full flex-1 rounded-full transition-all duration-500",
                      dotIndex < item.val ? "bg-primary shadow-sm shadow-primary/20" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {overallProgress >= 80 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative z-10 flex items-center gap-5 p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-xl shadow-emerald-500/5 overflow-hidden group/success"
          >
            <div className="h-14 w-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-emerald-500/30">
              <Trophy size={28} className="animate-bounce" />
            </div>
            <div>
              <h5 className="text-base font-black uppercase tracking-tight">মাশা-আল্লাহ!</h5>
              <p className="text-[11px] font-bold text-emerald-500/70 leading-relaxed uppercase">আপনার আজকের প্রগ্রেস অসাধারণ। আমলগুলো কবুল হোক ইনশা-আল্লাহ।</p>
            </div>
            <div className="absolute top-0 right-0 h-full w-24 bg-emerald-500/5 blur-2xl group-hover/success:bg-emerald-500/10 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
