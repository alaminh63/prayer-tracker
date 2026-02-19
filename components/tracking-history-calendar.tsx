"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar as CalendarIcon, Info, ChevronRight, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TrackingHistoryCalendar() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/deeds/history?days=30")
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Generate last 30 days
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split("T")[0]
  })

  const getDayData = (date: string) => {
    const record = history.find(h => h.date === date)
    if (!record) return { total: 14, completed: 0, percentage: 0, salat: 0, morning: 0, evening: 0, night: 0 }

    // Use migration logic here too if needed
    const salat = record.salat || record.prayers || {}
    const morning = record.morning || {}
    const evening = record.evening || {}
    const night = record.night || {}

    const salatCount = Object.values(salat).filter(v => v).length
    const morningCount = Object.values(morning).filter(v => v).length
    const eveningCount = Object.values(evening).filter(v => v).length
    const nightCount = Object.values(night).filter(v => v).length

    const completed = salatCount + morningCount + eveningCount + nightCount
    const total = 14 // 5 + 3 + 3 + 3
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
      salat: salatCount,
      morning: morningCount,
      evening: eveningCount,
      night: nightCount
    }
  }

  const getColorClass = (percentage: number) => {
    if (percentage === 0) return "bg-zinc-900 border-white/5 opacity-40"
    if (percentage < 30) return "bg-primary/20 border-primary/20"
    if (percentage < 60) return "bg-primary/40 border-primary/30"
    if (percentage < 90) return "bg-primary/70 border-primary/40 shadow-[0_0_10px_rgba(255,107,0,0.2)]"
    return "bg-primary border-primary shadow-[0_0_15px_rgba(255,107,0,0.4)]"
  }

  return (
    <div className="bg-zinc-950/40 border border-white/5 p-8 rounded-4xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute right-0 top-0 opacity-5 text-primary pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
         <History size={180} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <History size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">ইবাদতের ইতিহাস</h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">আপনার গত ৩০ দিনের আমলনামা</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 cursor-help hover:text-primary transition-all shadow-md">
                  <Info size={18} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-900 border-white/10 text-[11px] p-4 max-w-[240px] rounded-2xl shadow-2xl">
                রঙের গাঢ়ত্ব দিয়ে ওই দিনের আমল সম্পন্ন করার পরিমাণ বোঝানো হচ্ছে। বেশি গাঢ় মানে বেশি ইবাদত।
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 gap-3 md:gap-4 justify-items-center relative z-10">
        {loading ? (
          <div className="col-span-full h-32 flex items-center justify-center w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-bold text-zinc-600 uppercase">তথ্য লোড হচ্ছে...</p>
            </div>
          </div>
        ) : (
          last30Days.map((dateString) => {
            const data = getDayData(dateString)
            return (
              <TooltipProvider key={dateString}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      className={cn(
                        "h-10 w-10 sm:h-12 sm:w-12 rounded-xl border transition-all cursor-pointer shadow-lg",
                        getColorClass(data.percentage)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-950 border-white/10 p-6 rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl min-w-[200px]">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{dateString}</span>
                        <span className="text-xs font-black text-primary">{data.percentage}%</span>
                      </div>
                      
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${data.percentage}%` }}
                          className="h-full bg-primary" 
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                          <span className="text-[10px] font-bold text-zinc-400">সালাত</span>
                          <span className="text-xs font-black text-blue-400">{data.salat}/৫</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                          <span className="text-[10px] font-bold text-zinc-400">সকাল</span>
                          <span className="text-xs font-black text-orange-400">{data.morning}/৩</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                          <span className="text-[10px] font-bold text-zinc-400">সন্ধ্যা</span>
                          <span className="text-xs font-black text-rose-400">{data.evening}/৩</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                          <span className="text-[10px] font-bold text-zinc-400">রাত</span>
                          <span className="text-xs font-black text-indigo-400">{data.night}/৩</span>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })
        )}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 relative z-10 border-t border-white/5 pt-8">
        <div className="flex items-center gap-4 bg-zinc-900/40 px-4 py-2 rounded-full border border-white/5">
           <span>কম আমল</span>
           <div className="flex gap-1.5 pt-0.5">
             <div className="h-3 w-3 rounded bg-zinc-900 border border-white/5" />
             <div className="h-3 w-3 rounded bg-primary/20" />
             <div className="h-3 w-3 rounded bg-primary/40" />
             <div className="h-3 w-3 rounded bg-primary/70" />
             <div className="h-3 w-3 rounded bg-primary" />
           </div>
           <span>বেশি আমল</span>
        </div>
        <div className="flex items-center gap-2 text-primary cursor-pointer hover:gap-3 transition-all">
          সম্পূর্ণ রিপোর্ট দেখুন <ChevronRight size={14} />
        </div>
      </div>
    </div>
  )
}
