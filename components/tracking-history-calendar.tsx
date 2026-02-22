"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar as CalendarIcon, Info, ChevronRight, History, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TrackingHistoryCalendar({ fullWidth = false }: { fullWidth?: boolean }) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/deeds/history?days=180")
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Generate 6 months starting from Jan 1, 2026
  const startDate = new Date("2026-01-01")
  const daysCount = 182 // Approx 6 months (Jan to June)
  const displayDays = [...Array(daysCount)].map((_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    return d.toISOString().split("T")[0]
  })

  const getDayData = (date: string) => {
    const record = history.find(h => h.date === date)
    if (!record) return { total: 14, completed: 0, percentage: 0, salat: 0, morning: 0, evening: 0, night: 0 }

    const salat = record.salat || record.prayers || {}
    const morning = record.morning || {}
    const evening = record.evening || {}
    const night = record.night || {}

    const salatCount = Object.values(salat).filter(v => v).length
    const morningCount = Object.values(morning).filter(v => v).length
    const eveningCount = Object.values(evening).filter(v => v).length
    const nightCount = Object.values(night).filter(v => v).length

    const completed = salatCount + morningCount + eveningCount + nightCount
    const total = 14
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
    if (percentage === 0) return "bg-muted border-border opacity-40"
    if (percentage < 30) return "bg-primary/20 border-primary/20"
    if (percentage < 60) return "bg-primary/40 border-primary/30"
    if (percentage < 90) return "bg-primary/70 border-primary/40 shadow-[0_0_10px_rgba(255,107,0,0.2)]"
    return "bg-primary border-primary shadow-[0_0_15px_rgba(255,107,0,0.4)]"
  }

  return (
    <div className={cn(
      "bg-card border border-border p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group ring-1 ring-border",
      fullWidth ? "w-full" : ""
    )}>
      {/* Background Decor */}
      <div className="absolute right-0 top-0 opacity-5 text-primary pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
         <History size={fullWidth ? 300 : 180} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-500">
            <History size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground dark:text-white">ইবাদতের ইতিহাস</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase mt-1">জানুয়ারি ২০২৬ থেকে জুন ২০২৬</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground cursor-help hover:text-primary transition-all shadow-md group-hover:rotate-12">
                  <Info size={18} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-card border-border text-foreground dark:text-white text-[11px] p-4 max-w-[240px] rounded-2xl shadow-2xl backdrop-blur-xl">
                রঙের গাঢ়ত্ব দিয়ে ওই দিনের আমল সম্পন্ন করার পরিমাণ বোঝানো হচ্ছে। বেশি গাঢ় মানে বেশি ইবাদত।
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex flex-col gap-10 relative z-10 scrollbar-hide">
        {(() => {
          const monthlyData: { [key: string]: string[] } = {}
          displayDays.forEach(date => {
            const d = new Date(date)
            const monthYear = d.toLocaleDateString("bn-BD", { month: "long", year: "numeric" })
            if (!monthlyData[monthYear]) monthlyData[monthYear] = []
            monthlyData[monthYear].push(date)
          })

          return Object.entries(monthlyData).map(([monthYear, days]) => (
            <div key={monthYear} className="flex flex-col gap-4">
              <h4 className="text-sm font-black text-muted-foreground border-l-2 border-primary pl-3 ml-1 mb-2">
                {monthYear}
              </h4>
              <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-16 gap-2 sm:gap-3">
                {days.map((dateString) => {
                  const data = getDayData(dateString)
                  const dayNumber = new Date(dateString).getDate()
                  return (
                    <TooltipProvider key={dateString}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1, zIndex: 10 }}
                            className={cn(
                              "h-8 w-8 sm:h-10 sm:w-10 rounded-lg border transition-all cursor-pointer shadow-xs flex items-center justify-center relative group/box",
                              getColorClass(data.percentage)
                            )}
                          >
                            <span className={cn(
                              "text-[10px] sm:text-xs font-black transition-opacity",
                              data.percentage > 50 ? "text-white" : "text-muted-foreground group-hover/box:text-primary",
                              data.percentage === 0 && "opacity-40"
                            )}>
                              {dayNumber}
                            </span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-card border-border p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl min-w-[240px] ring-1 ring-border">
                          <div className="flex flex-col gap-5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted-foreground uppercase">{dateString === new Date().toISOString().split("T")[0] ? "আজ" : dateString}</span>
                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">{new Date(dateString).toLocaleDateString('bn-BD', { weekday: 'long' })}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-xl font-black text-primary">{data.percentage}%</span>
                                <span className="text-[8px] font-black text-primary/50 uppercase tracking-tighter">Completed</span>
                              </div>
                            </div>
                            
                            <div className="relative">
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden ring-1 ring-border p-[1px]">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${data.percentage}%` }}
                                  transition={{ duration: 1, ease: "circOut" }}
                                  className="h-full bg-linear-to-r from-primary/80 via-primary to-orange-400 rounded-full relative" 
                                >
                                  <div className="absolute inset-0 bg-white/20 blur-xs" />
                                  <motion.div 
                                    animate={{ 
                                      x: ["-100%", "100%"],
                                      opacity: [0, 1, 0]
                                    }}
                                    transition={{ 
                                      duration: 2, 
                                      repeat: Infinity, 
                                      ease: "linear" 
                                    }}
                                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                                  />
                                </motion.div>
                              </div>
                              {/* Status glow */}
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: `${data.percentage}%` }}
                                className="absolute -inset-px bg-primary/20 blur-md rounded-full -z-10"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                               <div className="flex flex-col gap-0.5 bg-secondary p-2.5 rounded-xl border border-border shadow-inner">
                                <span className="text-[8px] font-black text-muted-foreground uppercase">সালাত</span>
                                <span className="text-xs font-black text-sky-600 dark:text-sky-400">{data.salat}/৫</span>
                              </div>
                              <div className="flex flex-col gap-0.5 bg-secondary p-2.5 rounded-xl border border-border shadow-inner">
                                <span className="text-[8px] font-black text-muted-foreground uppercase">সকাল</span>
                                <span className="text-xs font-black text-amber-600 dark:text-amber-400">{data.morning}/৩</span>
                              </div>
                              <div className="flex flex-col gap-0.5 bg-secondary p-2.5 rounded-xl border border-border shadow-inner">
                                <span className="text-[8px] font-black text-muted-foreground uppercase">সন্ধ্যা</span>
                                <span className="text-xs font-black text-rose-600 dark:text-rose-400">{data.evening}/৩</span>
                              </div>
                              <div className="flex flex-col gap-0.5 bg-secondary p-2.5 rounded-xl border border-border shadow-inner">
                                <span className="text-[8px] font-black text-muted-foreground uppercase">রাত</span>
                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{data.night}/৩</span>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </div>
          ))
        })()}
      </div>

      <div className="mt-10 flex flex-col gap-8 relative z-10 border-t border-border pt-8">
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-3xl bg-secondary border border-border shadow-inner">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Completed</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground dark:text-white">{history.reduce((acc, h) => acc + (Object.values(h.salat || h.prayers || {}).filter(v => v).length + Object.values(h.morning || {}).filter(v => v).length + Object.values(h.evening || {}).filter(v => v).length + Object.values(h.night || {}).filter(v => v).length), 0)}</span>
                <span className="text-[10px] font-bold text-muted-foreground ml-1">Amols</span>
              </div>
           </div>
           <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 shadow-inner">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Consistency</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">{history.length > 0 ? Math.round(history.reduce((acc, h) => acc + (Object.values(h.salat || h.prayers || {}).filter(v => v).length + Object.values(h.morning || {}).filter(v => v).length + Object.values(h.evening || {}).filter(v => v).length + Object.values(h.night || {}).filter(v => v).length), 0) / (history.length * 14) * 100) : 0}%</span>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-black uppercase text-muted-foreground">
          <div className="flex items-center gap-3 bg-secondary px-3 py-1.5 rounded-full border border-border shadow-sm">
             <div className="flex gap-1 pt-0.5">
               <div className="h-2.5 w-2.5 rounded bg-muted border border-border" />
               <div className="h-2.5 w-2.5 rounded bg-primary/20" />
               <div className="h-2.5 w-2.5 rounded bg-primary/40" />
               <div className="h-2.5 w-2.5 rounded bg-primary/70" />
               <div className="h-2.5 w-2.5 rounded bg-primary shadow-[0_0_5px_rgba(255,107,0,0.5)]" />
             </div>
             <span>Activity Level</span>
          </div>
          <div className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors cursor-pointer group/link">
             View Detailed Report <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  )
}
