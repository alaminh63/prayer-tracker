"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle2, Circle, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

const PRAYER_IDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"]

export function SalatTracker() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [tracking, setTracking] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchTracking() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/prayers/track?date=${date}`)
        const data = await res.json()
        setTracking(data.prayers || {})
      } catch (error) {
        console.error("Failed to fetch tracking:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTracking()
  }, [date])

  const toggleStatus = async (prayerId: string) => {
    const newStatus = !tracking[prayerId]
    setTracking(prev => ({ ...prev, [prayerId]: newStatus }))

    try {
      await fetch("/api/prayers/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, prayerId, status: newStatus })
      })
    } catch (error) {
      console.error("Failed to update status:", error)
      // Rollback on error
      setTracking(prev => ({ ...prev, [prayerId]: !newStatus }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 glass-card border-none bg-linear-to-br from-primary/10 to-transparent">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none font-bold text-foreground focus:ring-0 cursor-pointer"
            />
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        </div>

        <div className="grid gap-3">
          {PRAYER_IDS.map(id => (
            <button
              key={id}
              onClick={() => toggleStatus(id)}
              disabled={isLoading}
              className={cn(
                "p-4 rounded-2xl flex items-center justify-between transition-all group",
                tracking[id] 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "bg-secondary/40 hover:bg-secondary/60 text-foreground border border-border/50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                  tracking[id] ? "bg-white/20" : "bg-primary/10 text-primary"
                )}>
                  {tracking[id] ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg">{t.prayers[id as keyof typeof t.prayers]}</h4>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    tracking[id] ? "text-white/70" : "text-muted-foreground"
                  )}>
                    {id} Prayer
                  </p>
                </div>
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                tracking[id] ? "bg-white/20" : "bg-primary/10 text-primary"
              )}>
                {tracking[id] ? t.common.done : t.common.mark}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 glass-card text-center italic text-xs text-muted-foreground">
        "{t.common.tracker_verse}" {t.common.tracker_source}
      </div>
    </div>
  )
}
