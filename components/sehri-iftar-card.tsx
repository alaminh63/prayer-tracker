"use client"

import { useAppSelector } from "@/store/hooks"
import { Moon, Sun, Clock } from "lucide-react"
import { formatTime12, getTimeDiff, formatCountdown } from "@/lib/prayer-utils"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SehriIftarCard() {
  const { timings, loading } = useAppSelector((state) => state.prayer)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading || !timings) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-xl bg-secondary p-6 animate-pulse"
          >
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-8 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  const sehriDiff = getTimeDiff(timings.Fajr)
  const iftarDiff = getTimeDiff(timings.Maghrib)

  const isSehriPassed = sehriDiff <= 0
  const isIftarPassed = iftarDiff <= 0

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Sehri Card */}
      <div className={cn(
        "flex flex-col items-center gap-3 rounded-[2rem] p-6 border transition-all duration-500",
        isSehriPassed 
          ? "bg-zinc-900/20 border-white/5 opacity-40 grayscale" 
          : "bg-zinc-900/40 border-white/5 shadow-lg shadow-black/20"
      )}>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner",
          isSehriPassed ? "bg-zinc-800 text-zinc-500" : "bg-primary/10 text-primary border border-primary/20"
        )}>
          <Moon className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
            আজকের সেহরি
          </p>
          <p className="text-2xl font-black text-white tracking-tighter">
            {formatTime12(timings.Fajr)}
          </p>
        </div>
        
        {!isSehriPassed && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Clock size={10} className="animate-pulse" />
            <span className="text-[10px] font-black tabular-nums">{formatCountdown(sehriDiff)}</span>
          </div>
        )}
        {isSehriPassed && (
          <span className="text-[10px] font-bold text-zinc-600 uppercase italic">সময় শেষ</span>
        )}
      </div>

      {/* Iftar Card */}
      <div className={cn(
        "flex flex-col items-center gap-3 rounded-[2rem] p-6 border transition-all duration-500",
        isIftarPassed 
          ? "bg-zinc-900/20 border-white/5 opacity-40 grayscale" 
          : "bg-zinc-900/40 border-white/5 shadow-lg shadow-black/20"
      )}>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner",
          isIftarPassed ? "bg-zinc-800 text-zinc-500" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
        )}>
          <Sun className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
            আজকের ইফতার
          </p>
          <p className="text-2xl font-black text-white tracking-tighter">
            {formatTime12(timings.Maghrib)}
          </p>
        </div>

        {!isIftarPassed && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <Clock size={10} className="animate-pulse" />
            <span className="text-[10px] font-black tabular-nums">{formatCountdown(iftarDiff)}</span>
          </div>
        )}
        {isIftarPassed && (
          <span className="text-[10px] font-bold text-zinc-600 uppercase italic">সময় শেষ</span>
        )}
      </div>
    </div>
  )
}
