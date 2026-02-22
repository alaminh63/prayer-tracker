"use client"

import React, { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchMonthlyPrayerTimes } from "@/store/prayerSlice"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { formatTime12 } from "@/lib/prayer-utils"

export function PrayerMonthlyCalendar() {
  const dispatch = useAppDispatch()
  const { latitude, longitude } = useAppSelector((state) => state.location)
  const { calculationMethod, asrMethod } = useAppSelector((state) => state.settings)
  const { monthlyTimings, loading } = useAppSelector((state) => state.prayer)
  const { t } = useTranslation()

  useEffect(() => {
    if (latitude && longitude && !monthlyTimings) {
      dispatch(fetchMonthlyPrayerTimes({ 
        latitude, 
        longitude, 
        method: calculationMethod, 
        school: asrMethod 
      }))
    }
  }, [latitude, longitude, calculationMethod, asrMethod, monthlyTimings, dispatch])

  if (loading && !monthlyTimings) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-muted/20 rounded-xl w-full" />
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/10 rounded-lg w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!monthlyTimings) return null

  const today = new Date().getDate()

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-border bg-card backdrop-blur-xl">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="p-4 text-[10px] font-black uppercase text-muted-foreground text-center">তারিখ</th>
            <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">ফজর</th>
            <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">সূর্যোদয়</th>
            <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">যোহর</th>
            <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">আসর</th>
            <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">মাগরিব</th>
            <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">এশা</th>
          </tr>
        </thead>
        <tbody>
          {monthlyTimings.map((day: any, index: number) => {
            const dayNum = parseInt(day.date.gregorian.day)
            const isToday = dayNum === today
            
            return (
              <tr 
                key={index} 
                className={cn(
                  "border-b border-border transition-colors",
                  isToday ? "bg-primary/5" : "hover:bg-muted/30"
                )}
              >
                <td className="p-4 text-center">
                  <div className={cn(
                    "flex flex-col items-center justify-center h-10 w-10 rounded-xl mx-auto shadow-sm",
                    isToday ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    <span className="text-xs font-black">{dayNum}</span>
                    <span className="text-[8px] uppercase">{day.date.gregorian.weekday.en.substring(0, 3)}</span>
                  </div>
                </td>
                <td className="p-4 text-sm font-mono text-foreground dark:text-zinc-300">{formatTime12(day.timings.Fajr.split(" ")[0])}</td>
                <td className="p-4 text-sm font-mono text-muted-foreground dark:text-zinc-500">{formatTime12(day.timings.Sunrise.split(" ")[0])}</td>
                <td className="p-4 text-sm font-mono text-foreground dark:text-zinc-300">{formatTime12(day.timings.Dhuhr.split(" ")[0])}</td>
                <td className="p-4 text-sm font-mono text-foreground dark:text-zinc-300">{formatTime12(day.timings.Asr.split(" ")[0])}</td>
                <td className="p-4 text-sm font-mono text-foreground dark:text-zinc-300">{formatTime12(day.timings.Maghrib.split(" ")[0])}</td>
                <td className="p-4 text-sm font-mono text-foreground dark:text-zinc-300">{formatTime12(day.timings.Isha.split(" ")[0])}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
