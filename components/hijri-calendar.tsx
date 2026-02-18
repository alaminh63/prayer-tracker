"use client"

import React, { useState, useEffect } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/store/hooks"
import { HIJRI_MONTHS, ISLAMIC_EVENTS } from "@/lib/hijri-events"

export function HijriCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hijriDate, setHijriDate] = useState<{ day: number; month: number; year: number; monthName: string; monthNameBn: string } | null>(null)
  const { hijriOffset } = useAppSelector((state) => state.settings)

  useEffect(() => {
    // Apply offset
    const adjustedDate = new Date(currentDate)
    adjustedDate.setDate(adjustedDate.getDate() + hijriOffset)

    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
    
    const parts = formatter.formatToParts(adjustedDate)
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1')
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1')
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '1445')

    setHijriDate({
      day,
      month,
      year,
      monthName: HIJRI_MONTHS[month - 1].en,
      monthNameBn: HIJRI_MONTHS[month - 1].bn
    })
  }, [currentDate, hijriOffset])

  const nextMonth = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }

  const prevMonth = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() - 1)
    setCurrentDate(d)
  }

  if (!hijriDate) return null

  const upcomingEvents = ISLAMIC_EVENTS.filter(e => e.hijriMonth === hijriDate.month || e.hijriMonth === (hijriDate.month % 12) + 1)

  return (
    <div className="flex flex-col gap-6">
      {/* Hijri Date Hero */}
      <div className="p-8 glass-card bg-linear-to-br from-primary/10 to-transparent flex flex-col items-center text-center">
        <CalendarIcon className="h-10 w-10 text-primary mb-4" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">Islamic Date</p>
          <h2 className="text-4xl font-black text-gradient">
            {hijriDate.day} {hijriDate.monthNameBn}
          </h2>
          <p className="text-xl font-bold text-foreground/80">
            {hijriDate.monthName} {hijriDate.year} AH
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-6">
          <button onClick={prevMonth} className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs font-mono text-muted-foreground">
            {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-1">Upcoming Events (আসন্ন বিশেষ দিনসমূহ)</h3>
        <div className="grid gap-3">
          {upcomingEvents.map(event => (
            <div key={event.id} className="p-4 glass-card border-none flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                  event.type === 'holiday' ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                )}>
                  <Star className={cn("h-5 w-5", event.type === 'holiday' && "fill-current")} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{event.nameBn}</h4>
                  <p className="text-xs text-muted-foreground">{event.name} • {event.hijriDay} {HIJRI_MONTHS[event.hijriMonth - 1].bn}</p>
                </div>
              </div>
              {event.type === 'holiday' && (
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-md uppercase">Holiday</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
