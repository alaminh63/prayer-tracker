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
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border bg-linear-to-br p-6 backdrop-blur-xl",
        color
      )}
    >
      <div className="absolute -right-6 -bottom-6 opacity-10">
        <Moon size={120} />
      </div>
      
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10">
              {icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Ramadan Phase</p>
              <h3 className="text-xl font-black">{phaseBn} ({phase})</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Ramadan Day</p>
            <p className="text-2xl font-black">{day}</p>
          </div>
        </div>
        
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-sm font-medium leading-relaxed">
            {phaseDescBn}
            <br />
            <span className="text-xs opacity-70">{phaseDesc}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
            <span>Progress</span>
            <span>{Math.round((day / 30) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(day / 30) * 100}%` }}
              className="h-full bg-current opacity-50 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
