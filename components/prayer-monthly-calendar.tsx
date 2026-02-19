"use client"

import React, { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchMonthlyPrayerTimes } from "@/store/prayerSlice"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

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
    <div className="w-full overflow-x-auto rounded-3xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/5 bg-white/5">
            <th className="p-4 text-[10px] font-black uppercase text-zinc-500 text-center">তারিখ</th>
            <th className="p-4 text-[10px] font-black uppercase text-zinc-500">ফজর</th>
            <th className="p-4 text-[10px] font-black uppercase text-zinc-500">সূর্যোদয়</th>
            <th className="p-4 text-[10px] font-black uppercase text-zinc-500">যোহর</th>
            <th className="p-4 text-[10px] font-black uppercase text-zinc-500">আসর</th>
            <th className="p-4 text-[10px] font-black uppercase text-zinc-500">মাগরিব</th>
            <th className="p-4 text-[10px] font-black uppercase text-zinc-500">এশা</th>
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
                  "border-b border-white/5 transition-colors",
                  isToday ? "bg-primary/10" : "hover:bg-white/5"
                )}
              >
                <td className="p-4 text-center">
                  <div className={cn(
                    "flex flex-col items-center justify-center h-10 w-10 rounded-xl mx-auto",
                    isToday ? "bg-primary text-white" : "bg-white/5 text-zinc-400"
                  )}>
                    <span className="text-xs font-black">{dayNum}</span>
                    <span className="text-[8px] uppercase">{day.date.gregorian.weekday.en.substring(0, 3)}</span>
                  </div>
                </td>
                <td className="p-4 text-sm font-mono text-zinc-300">{day.timings.Fajr.split(" ")[0]}</td>
                <td className="p-4 text-sm font-mono text-zinc-500">{day.timings.Sunrise.split(" ")[0]}</td>
                <td className="p-4 text-sm font-mono text-zinc-300">{day.timings.Dhuhr.split(" ")[0]}</td>
                <td className="p-4 text-sm font-mono text-zinc-300">{day.timings.Asr.split(" ")[0]}</td>
                <td className="p-4 text-sm font-mono text-zinc-300">{day.timings.Maghrib.split(" ")[0]}</td>
                <td className="p-4 text-sm font-mono text-zinc-300">{day.timings.Isha.split(" ")[0]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
