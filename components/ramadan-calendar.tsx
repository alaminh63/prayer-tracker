"use client"

import React, { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchMonthlyPrayerTimes } from "@/store/prayerSlice"
import { cn } from "@/lib/utils"
import { Sunrise, Sunset, Star, Moon, Heart, MapPin, BookOpen, Quote } from "lucide-react"
import { motion } from "framer-motion"

export function RamadanCalendar() {
  const dispatch = useAppDispatch()
  const { latitude, longitude, city } = useAppSelector((state) => state.location)
  const { calculationMethod, asrMethod } = useAppSelector((state) => state.settings)
  const { monthlyTimings, loading } = useAppSelector((state) => state.prayer)
  
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
      <div className="w-full space-y-8 animate-pulse">
        <div className="h-64 bg-muted/20 rounded-4xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-muted/10 rounded-3xl w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!monthlyTimings) return null

  const getAshra = (day: number) => {
     if (day <= 10) return { name: "রহমত", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
     if (day <= 20) return { name: "মাগফিরাত", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" }
     return { name: "নাজাত", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" }
  }

  const today = new Date().getDate()
  const todayMonth = new Date().getMonth() + 1
  const todayYear = new Date().getFullYear()
  
  return (
    <div className="space-y-12">
      {/* Hero Summary Section */}
      <section className="relative overflow-hidden p-8 md:p-12 rounded-[2.5rem] bg-zinc-950/40 border border-white/10 backdrop-blur-3xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                <MapPin size={14} />
                {city || "Current Location"}
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
               রমজান স্পেশাল <span className="text-gradient">২০২৬</span>
             </h1>
             <p className="text-zinc-400 max-w-xl text-lg font-medium leading-relaxed">
               আপনার অবস্থানের সঠিক সেহরি ও ইফতারের সময় এবং রমজানের গুরুত্বপূর্ণ আমলসমূহ এখানে পাবেন ইনশাআল্লাহ।
             </p>
          </div>
          
          <div className="flex gap-4">
             <div className="p-8 rounded-4xl bg-white/5 border border-white/5 backdrop-blur-xl text-center min-w-[160px]">
                <Moon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">আজকের রমজান</p>
                <h3 className="text-3xl font-black text-white">১লা</h3>
             </div>
             <div className="p-8 rounded-4xl bg-primary/10 border border-primary/20 backdrop-blur-xl text-center min-w-[160px]">
                <Sunrise className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">বর্তমান আশরা</p>
                <h3 className="text-3xl font-black text-primary">রহমত</h3>
             </div>
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-emerald-500/10 blur-[120px] rounded-full -ml-48 -mb-48" />
      </section>

      {/* Ramadan Duas Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="group relative overflow-hidden p-8 rounded-4xl bg-zinc-950/40 border border-white/10 hover:border-primary/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen size={24} />
               </div>
               <h3 className="text-2xl font-black text-white">রোজার নিয়ত</h3>
            </div>
            <div className="space-y-4">
               <p className="text-xl font-serif text-zinc-300 leading-relaxed text-right md:text-left" dir="rtl">
                 نَوَيْتُ اَنْ اَصُوْمَ غَدًا مِّنْ شَهْرِ رَمْضَانَ الْمُبَارَكِ فَرْضًا لَّكَ يَا اَللهُ فَتَقَبَّلْ مِنِّى اِنَّكَ اَنْتَ السَّمِيْعُ الْعَلِيْمُ
               </p>
               <div className="pt-4 border-t border-white/5">
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    "হে আল্লাহ! আমি আগামীকাল পবিত্র রমজান মাসের তোমার পক্ষ থেকে নির্ধারিত ফরজ রোজা রাখার নিয়ত করছি। অতএব তুমি আমার পক্ষ থেকে তা কবুল কর। নিশ্চয়ই তুমি সর্বশ্রোতা ও সর্বজ্ঞ।"
                  </p>
               </div>
            </div>
         </div>

         <div className="group relative overflow-hidden p-8 rounded-4xl bg-zinc-950/40 border border-white/10 hover:border-primary/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
               <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sunset size={24} />
               </div>
               <h3 className="text-2xl font-black text-white">ইফতারের দোয়া</h3>
            </div>
            <div className="space-y-4">
               <p className="text-xl font-serif text-zinc-300 leading-relaxed text-right md:text-left" dir="rtl">
                 اَللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ
               </p>
               <div className="pt-4 border-t border-white/5">
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    "হে আল্লাহ! আমি তোমারই সন্তুষ্টির জন্য রোজা রেখেছি এবং তোমারই দেয়া রিযিক দিয়ে ইফতার করছি।"
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Daily Schedule Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Star className="text-primary fill-primary/20" />
              রমজানের সময়সূচী
           </h2>
           <div className="hidden md:flex gap-4">
             {["রহমত", "মাগফিরাত", "নাজাত"].map((name, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className={cn("h-2 w-2 rounded-full", i===0?"bg-emerald-500":i===1?"bg-sky-500":"bg-amber-500")} />
                   <span className="text-[10px] font-black uppercase text-zinc-500">{name}</span>
                </div>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {monthlyTimings.map((day: any, index: number) => {
            const ramadanDay = index + 1
            const ashra = getAshra(ramadanDay)
            const isToday = parseInt(day.date.gregorian.day) === today && 
                        parseInt(day.date.gregorian.month.number.toString()) === todayMonth &&
                        parseInt(day.date.gregorian.year) === todayYear;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative overflow-hidden p-6 rounded-4xl border transition-all duration-500 group",
                  isToday 
                    ? "bg-primary/15 border-primary/40 shadow-2xl shadow-primary/10 ring-1 ring-primary/20" 
                    : "bg-zinc-950/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/60"
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", ashra.bg, ashra.color, ashra.border)}>
                    {ramadanDay} রমজান • {ashra.name}
                  </div>
                  {isToday && (
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black text-primary uppercase animate-pulse">আজ</span>
                       <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h3 className="text-4xl font-black text-white tabular-nums tracking-tighter">{day.date.gregorian.day}</h3>
                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                      {day.date.gregorian.month.en} • {day.date.gregorian.weekday.en}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">হিজরি</p>
                     <p className="text-sm font-bold text-white">{day.date.hijri.day} {day.date.hijri.month.en}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                           <Sunrise size={16} />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">সেহরি শেষ</span>
                     </div>
                     <p className="text-xl font-mono font-black text-white tabular-nums">
                       {day.timings.Fajr.split(" ")[0]}
                     </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                           <Sunset size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">ইফতার শুরু</span>
                     </div>
                     <p className="text-xl font-mono font-black text-primary tabular-nums">
                       {day.timings.Maghrib.split(" ")[0]}
                     </p>
                  </div>
                </div>

                {isToday && (
                  <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/20 blur-3xl rounded-full opacity-50" />
                )}
              </motion.div>
            )
          })}
        </div>
      </section>
      
      {/* Footer Info */}
      <footer className="p-8 rounded-[2rem] bg-zinc-950/20 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <Quote size={18} />
            </div>
            <p className="max-w-md text-sm text-zinc-400 italic font-medium">
              "রোজা ঢাল স্বরূপ, সুতরাং রোজা পালনকারী যেন অশ্লীল কথা না বলে এবং জাহেলী আচরণ না করে।" - (বুখারী ও মুসলিম)
            </p>
         </div>
         <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            Provided by Aladhan • Accurate for {city || "your current location"}
         </div>
      </footer>
    </div>
  )
}
