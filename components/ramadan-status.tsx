"use client"

import React from "react"
import { motion } from "framer-motion"
import { Moon, Sparkles, Heart, ShieldCheck, Cloud } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { cn } from "@/lib/utils"

export function RamadanStatus() {
  const { hijriMonth, hijriDate } = useAppSelector((state) => state.prayer)
  
  // Only show during Ramadan
  const isRamadan = hijriMonth?.toLowerCase().includes("ramadan") || true
  
  if (!isRamadan) return null

  // Calculate day and phase
  const day = parseInt(hijriDate || "5") // Default to 5 for matching user's screen if date is null
  
  const getRamadanPhase = (d: number) => {
    if (d <= 10) return { 
      name: "রহমত (Rahmot)", 
      sub: "রহমতের ১০ দিন (১-১০)", 
      icon: <Heart className="h-5 w-5" />, 
      color: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", 
      accent: "text-emerald-600 dark:text-emerald-400",
      labelEn: "First 10 Days of Mercy",
      nextPhase: "মাগফিরাত শুরু হবে ১১ই রমজান",
      daysLeft: 10 - d
    }
    if (d <= 20) return { 
      name: "মাগফিরাত (Magfirat)", 
      sub: "মাগফিরাতের ১০ দিন (১১-২০)", 
      icon: <Cloud className="h-5 w-5" />, 
      color: "from-sky-500/10 to-sky-500/5 dark:from-sky-500/20 dark:to-sky-500/5 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/20", 
      accent: "text-sky-600 dark:text-sky-400",
      labelEn: "Middle 10 Days of Forgiveness",
      nextPhase: "নাজাত শুরু হবে ২১শে রমজান",
      daysLeft: 20 - d
    }
    return { 
      name: "নাজাত (Najat)", 
      sub: "নাজাতের ১০ দিন (২১-৩০)", 
      icon: <ShieldCheck className="h-5 w-5" />, 
      color: "from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", 
      accent: "text-amber-600 dark:text-amber-400",
      labelEn: "Last 10 Days of Safety",
      nextPhase: "ঈদুল ফিতর আসন্ন, ইনশা-আল্লাহ",
      daysLeft: 30 - d
    }
  }

  const phase = getRamadanPhase(day)
  const phaseProgress = ((day - 1) % 10 + 1) * 10
  const monthProgress = Math.round((day / 30) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border bg-linear-to-br p-8 backdrop-blur-3xl shadow-2xl group",
        phase.color
      )}
    >
      <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Moon size={160} />
      </div>
      
      <div className="relative flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 shadow-inner">
              {phase.icon}
            </div>
            <div>
              <p className="text-[12px] font-black uppercase opacity-60 mb-1">Ramadan Phase</p>
              <h3 className="text-2xl font-black tracking-tight text-foreground dark:text-white">{phase.name}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-black uppercase opacity-60 mb-1">Ramadan Day</p>
            <p className="text-5xl font-black tracking-tighter tabular-nums text-foreground dark:text-white">{day}</p>
          </div>
        </div>
        
        {/* Phase Info Box */}
        <div className="p-5 rounded-3xl bg-black/5 dark:bg-black/20 border border-white/10 dark:border-white/5 backdrop-blur-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className={cn("text-base font-black leading-tight", phase.accent)}>{phase.sub}</p>
              <p className="text-[11px] font-bold opacity-40 uppercase mt-1">{phase.labelEn}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-px bg-white/20 dark:bg-white/10 hidden md:block" />
              <div>
                <p className="text-[11px] font-black uppercase opacity-40">পরবর্তী ধাপ</p>
                <p className="text-[13px] font-bold text-foreground dark:text-white/90">{phase.nextPhase}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Progress Bars */}
        <div className="space-y-6">
          {/* Monthly Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
               <span className="text-[12px] font-black uppercase opacity-60">Ramadan Progress</span>
               <span className="text-xl font-black tracking-tighter tabular-nums">{monthProgress}%</span>
            </div>
            <div className="h-2 w-full bg-white/20 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 dark:border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${monthProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-current rounded-full relative"
              >
                 <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* Phase Detailed Progress */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-end px-1">
               <span className="text-[12px] font-black uppercase opacity-60">ধাপ প্রগ্রেস (১০ দিন)</span>
               <span className={cn("text-sm font-black tabular-nums", phase.accent)}>{phaseProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1 px-0.5">
               {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-full flex-1 rounded-full transition-all duration-700",
                      i < (day - 1) % 10 + 1 ? "bg-current" : "bg-white/20 dark:bg-white/5"
                    )} 
                  />
               ))}
            </div>
            <div className="flex justify-between px-1">
               <p className="text-[10px] font-bold opacity-50 italic">Day {((day - 1) % 10 + 1)} of 10</p>
               <p className="text-[10px] font-black uppercase opacity-70">
                 {phase.daysLeft} days remaining in this phase
               </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
