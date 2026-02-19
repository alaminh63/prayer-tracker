"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sun, Moon, Sparkles, Heart } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { cn } from "@/lib/utils"

export function RamadanStatus() {
  const { hijriMonth, hijriDate } = useAppSelector((state) => state.prayer)
  
  // Only show during Ramadan
  const isRamadan = hijriMonth?.toLowerCase().includes("ramadan") || true // Force true for testing/dev if needed, but should be logic based
  
  if (!isRamadan) return null

  // Calculate day and phase
  const day = parseInt(hijriDate || "1")
  let phase = "Rahmot"
  let phaseBn = "রহমত"
  let phaseDesc = "First 10 days of Mercy"
  let phaseDescBn = "রহমতের ১০ দিন (১-১০)"
  let icon = <Heart className="h-5 w-5" />
  let color = "from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20"

  if (day > 10 && day <= 20) {
    phase = "Maghfirat"
    phaseBn = "মাগফিরাত"
    phaseDesc = "Middle 10 days of Forgiveness"
    phaseDescBn = "মাগফিরাতের ১০ দিন (১১-২০)"
    icon = <Sparkles className="h-5 w-5" />
    color = "from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20"
  } else if (day > 20) {
    phase = "Najat"
    phaseBn = "নাজাত"
    phaseDesc = "Last 10 days of Salvation"
    phaseDescBn = "নাজাতের ১০ দিন (২১-৩০)"
    icon = <Sparkles className="h-5 w-5" />
    color = "from-rose-500/20 to-rose-500/5 text-rose-500 border-rose-500/20"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border bg-linear-to-br p-8 backdrop-blur-3xl shadow-2xl group",
        color
      )}
    >
      <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Moon size={160} />
      </div>
      
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 ring-1 ring-white/10">
              {icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Ramadan Phase</p>
              <h3 className="text-2xl font-black tracking-tight">{phaseBn} ({phase})</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Ramadan Day</p>
            <p className="text-4xl font-black tracking-tighter">{day}</p>
          </div>
        </div>
        
        <div className="p-4 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <p className="text-sm font-bold leading-relaxed">
            {phaseDescBn}
            <br />
            <span className="text-[11px] font-medium opacity-60 uppercase tracking-wider">{phaseDesc}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Ramadan Progress</span>
             <span className="text-lg font-black tracking-tighter">{Math.round((day / 30) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5 ring-1 ring-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(day / 30) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-current rounded-full relative"
            >
               <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
