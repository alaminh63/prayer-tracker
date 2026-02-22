"use client"

import React, { useState } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star, Loader2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/store/hooks"
import { HIJRI_MONTHS, ISLAMIC_EVENTS } from "@/lib/hijri-events"
import { useCalendar, useYearlyCalendar, CalendarDay } from "@/hooks/use-calendar"

export function HijriCalendar() {
  const [viewDate, setViewDate] = useState(new Date())
  const { latitude, longitude } = useAppSelector((state) => state.location)
  const { calculationMethod } = useAppSelector((state) => state.settings)
  const [view, setView] = useState<"monthly" | "yearly">("monthly")
  
  const currentMonth = viewDate.getMonth() + 1
  const currentYear = viewDate.getFullYear()

  const { days, isLoading } = useCalendar(
    currentYear,
    currentMonth,
    latitude,
    longitude,
    calculationMethod
  )

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const weekDaysBn = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"]

  const firstDayOfWeek = days.length > 0 ? weekDays.indexOf(days[0].date.gregorian.weekday.en.substring(0, 3)) : 0
  const paddingDays = Array.from({ length: firstDayOfWeek })

  const currentDayStr = new Date().getDate().toString().padStart(2, '0')
  const isCurrentMonth = new Date().getMonth() === viewDate.getMonth() && new Date().getFullYear() === viewDate.getFullYear()

  if (isLoading && days.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const todayDay = isCurrentMonth ? days.find(d => d.date.gregorian.day === currentDayStr) : days[0]
  const currentHijri = todayDay?.date.hijri

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card border border-border rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-sm ring-1 ring-border">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <CalendarIcon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gradient leading-tight">
              {view === "monthly" ? (currentHijri ? `${HIJRI_MONTHS[currentHijri.month.number - 1].bn} ${currentHijri.year} হিজরি` : 'Islamic Calendar') : `${currentYear} সালের হিজরি ক্যালেন্ডার`}
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1">
              {view === "monthly" ? viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : `${currentYear} Yearly Overview`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* View Toggle */}
           <div className="flex p-1 bg-secondary rounded-2xl border border-border shadow-inner">
             <button 
               onClick={() => setView("monthly")}
               className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase transition-all", view === "monthly" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground")}
             >
               মাসিক
             </button>
             <button 
               onClick={() => setView("yearly")}
               className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase transition-all", view === "yearly" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground")}
             >
               বার্ষিক
             </button>
           </div>

           {view === "monthly" && (
             <div className="flex items-center gap-2 bg-secondary p-1.5 rounded-2xl border border-border shadow-inner">
               <button onClick={prevMonth} className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                 <ChevronLeft className="h-5 w-5" />
               </button>
               <div className="px-4 text-xs font-bold uppercase tracking-widest text-primary/80 min-w-[120px] text-center">
                 {viewDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
               </div>
               <button onClick={nextMonth} className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                 <ChevronRight className="h-5 w-5" />
               </button>
             </div>
           )}
        </div>
      </div>

      {view === "monthly" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Monthly Grid */}
          <div className="lg:col-span-8 bg-card border border-border rounded-4xl overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-border">
            <div className="grid grid-cols-7 border-b border-border bg-secondary/50">
              {weekDaysBn.map((day, i) => (
                <div key={day} className={cn(
                  "py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60",
                  (i === 5 || i === 0) && "text-primary/50"
                )}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {paddingDays.map((_, i) => (
                <div key={`padding-${i}`} className="aspect-[1/1.2] md:aspect-square border-r border-b border-border bg-muted/5 group-hover:bg-muted/10 transition-colors" />
              ))}
              
              {days.map((day, i) => {
                const isToday = isCurrentMonth && day.date.gregorian.day === currentDayStr
                const hasEvent = day.date.hijri.holidays.length > 0
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-[1/1.2] md:aspect-square border-r border-b border-border p-3 md:p-6 flex flex-col justify-between transition-all relative group overflow-hidden",
                      isToday ? "bg-primary/10" : "hover:bg-muted/50",
                      (weekDays.indexOf(day.date.gregorian.weekday.en.substring(0, 3)) === 5) && "bg-emerald-500/5 dark:bg-emerald-500/5 shadow-inner"
                    )}
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <span className={cn(
                        "text-xl md:text-3xl font-black transition-all group-hover:scale-110 origin-left",
                        isToday ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                      )}>
                        {day.date.gregorian.day}
                      </span>
                      {hasEvent && (
                        <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse" />
                      )}
                    </div>
                    
                    <div className="text-right relative z-10">
                      <p className={cn(
                        "text-xs md:text-sm font-black font-mono tracking-tighter",
                        isToday ? "text-primary/90" : "text-muted-foreground/80"
                      )}>
                        {day.date.hijri.day}
                      </p>
                      <p className="text-[9px] text-muted-foreground/40 hidden md:block uppercase font-black tracking-widest mt-0.5">
                         {HIJRI_MONTHS[day.date.hijri.month.number - 1].bn}
                      </p>
                    </div>

                    {isToday && (
                      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 pointer-events-none" />
                    )}
                    {isToday && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-lg shadow-primary/50 z-20" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Events / Holidays */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black text-foreground dark:text-white flex items-center gap-3">
                <Star className="h-6 w-6 text-primary fill-primary/20" />
                বিশেষ দিনসমূহ
              </h3>
              <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground">
                <Info size={14} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {days.filter(d => d.date.hijri.holidays.length > 0).length > 0 ? (
                days.filter(d => d.date.hijri.holidays.length > 0).map((day, i) => (
                  <div 
                    key={i} 
                    className="group relative overflow-hidden p-6 rounded-4xl bg-card border border-border shadow-sm hover:border-primary/30 transition-all duration-500 flex flex-col gap-4 ring-1 ring-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-primary/20">
                        <span className="font-black text-2xl tabular-nums">{day.date.hijri.day}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">হিজরি তারিখ</p>
                        <p className="text-sm font-bold text-muted-foreground">
                          {HIJRI_MONTHS[day.date.hijri.month.number - 1].bn}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-black text-foreground dark:text-white text-xl leading-tight group-hover:text-primary transition-colors">
                        {day.date.hijri.holidays.join(', ')}
                      </h4>
                      <p className="text-sm text-muted-foreground font-medium">
                        {day.date.gregorian.day} {viewDate.toLocaleDateString(undefined, { month: 'long' })} • {day.date.gregorian.weekday.en}
                      </p>
                    </div>

                    <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-secondary/30 rounded-4xl border border-dashed border-border flex flex-col items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30">
                      <Star size={20} className="opacity-20" />
                   </div>
                   <p className="text-sm text-muted-foreground italic font-medium max-w-[200px]">
                     এই মাসে কোনো বিশেষ ইসলামিক দিবস পাওয়া যায়নি।
                   </p>
                </div>
              )}
            </div>

            {/* Quick Summary Card */}
            <div className="p-6 rounded-4xl bg-primary/5 border border-primary/10">
               <div className="flex items-center gap-3 mb-4">
                  <Star className="h-4 w-4 text-primary" />
                  <p className="text-[11px] font-black text-primary uppercase tracking-widest">ইসলামিক মাস</p>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                 {currentHijri ? HIJRI_MONTHS[currentHijri.month.number - 1].bn : '---'} হলো হিজরি ক্যালেন্ডারের ২য় মাস। এই মাসে কোনো বিশেষ আমল থাকলে তা আমাদের ইমান বৃদ্ধিতে সাহায্য করে।
               </p>
            </div>
          </div>
        </div>
      ) : (
        <YearlyView 
          currentYear={currentYear} 
          latitude={latitude} 
          longitude={longitude} 
          calculationMethod={calculationMethod} 
        />
      )}
    </div>
  )
}

function YearlyView({ 
  currentYear, 
  latitude, 
  longitude, 
  calculationMethod 
}: { 
  currentYear: number
  latitude: number | null
  longitude: number | null
  calculationMethod: number
}) {
  const { calendar, isLoading } = useYearlyCalendar(currentYear, latitude, longitude, calculationMethod)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-64 bg-muted/10 rounded-4xl w-full" />
        ))}
      </div>
    )
  }

  if (!calendar) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Object.keys(calendar).sort((a, b) => parseInt(a) - parseInt(b)).map((monthNum) => {
        const monthDays = calendar[monthNum]
        const monthIdx = parseInt(monthNum) - 1
        return (
          <div key={monthNum} className="p-5 rounded-4xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all flex flex-col gap-4 group ring-1 ring-border">
             <div className="flex items-center justify-between">
               <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                 {monthNum}
               </div>
               <div className="text-right">
                 <h4 className="text-lg font-black text-foreground dark:text-white leading-tight">{HIJRI_MONTHS[monthIdx].bn}</h4>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{HIJRI_MONTHS[monthIdx].en}</p>
               </div>
             </div>

             <div className="grid grid-cols-7 text-[8px] font-black text-muted-foreground uppercase mb-1">
                {["S", "M", "T", "W", "T", "F", "S"].map(d => <div key={d} className="text-center">{d}</div>)}
             </div>

             <MiniMonthGrid days={monthDays} />

             <div className="pt-3 border-t border-border">
                <div className="flex flex-wrap gap-1">
                   {ISLAMIC_EVENTS.filter(e => e.hijriMonth === parseInt(monthNum)).map(e => (
                     <div key={e.id} className="px-2 py-0.5 rounded-full bg-primary/10 text-[8px] font-bold text-primary border border-primary/10">
                       {e.nameBn}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )
      })}
    </div>
  )
}

function MiniMonthGrid({ days }: { days: CalendarDay[] }) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const firstDay = weekDays.indexOf(days[0].date.gregorian.weekday.en.substring(0, 3))
  const padding = Array.from({ length: firstDay })
  const todayDate = new Date().getDate()
  const todayMonth = new Date().getMonth() + 1
  const todayYear = new Date().getFullYear()

  return (
    <div className="grid grid-cols-7 gap-1">
      {padding.map((_, i) => <div key={`p-${i}`} className="aspect-square bg-transparent" />)}
      {days.map((day, i) => {
        const isToday = parseInt(day.date.gregorian.day) === todayDate && 
                        parseInt(day.date.gregorian.month.number.toString()) === todayMonth &&
                        parseInt(day.date.gregorian.year) === todayYear;
        const hasEvent = day.date.hijri.holidays.length > 0

        return (
          <div 
            key={i} 
            className={cn(
              "aspect-square rounded flex items-center justify-center text-[10px] relative",
              isToday ? "bg-primary text-white font-black" : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/50 transition-colors"
            )}
          >
            {day.date.gregorian.day}
            {hasEvent && !isToday && (
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-primary" />
            )}
          </div>
        )
      })}
    </div>
  )
}
