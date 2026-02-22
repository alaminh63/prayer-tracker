"use client"

import React from "react"
import { useAppSelector } from "@/store/hooks"
import { cn } from "@/lib/utils"
import { Sunrise, Sunset, Star, Moon, MapPin, BookOpen, Quote, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { formatTime12 } from "@/lib/prayer-utils"
import { useHijriCalendar } from "@/hooks/use-calendar"

export function RamadanCalendar() {
  const { latitude, longitude, city } = useAppSelector((state) => state.location)
  const { calculationMethod } = useAppSelector((state) => state.settings)
  
  // Ramadan 2026 is 1447 AH
  const hijriYear = 1447
  const hijriMonth = 9 // Ramadan
  
  const { days: ramadanTimings, isLoading } = useHijriCalendar(
    hijriYear,
    hijriMonth,
    latitude,
    longitude,
    calculationMethod
  )

  if (isLoading && ramadanTimings.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-black text-muted-foreground uppercase">রমজানের সময়সূচী লোড হচ্ছে...</p>
      </div>
    )
  }

  const getAshra = (day: number) => {
     if (day <= 10) return { name: "রহমত", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
     if (day <= 20) return { name: "মাগফিরাত", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" }
     return { name: "নাজাত", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" }
  }

  const now = new Date()
  const todayDate = now.getDate()
  const todayMonth = now.getMonth() + 1
  const todayYear = now.getFullYear()
  
  const currentRamadanDay = ramadanTimings.find((day: any) => {
    const d = day.date.gregorian
    return parseInt(d.day) === todayDate && 
           parseInt(d.month.number.toString()) === todayMonth && 
           parseInt(d.year) === todayYear
  })

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Summary Section */}
      <section className="relative overflow-hidden p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-card border border-border shadow-xl ring-1 ring-border">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-left">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase">
                <MapPin size={14} />
                {city || "Current Location"}
             </div>
             <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground dark:text-white leading-tight">
               রমজান স্পেশাল <span className="text-gradient">২০২৬</span>
             </h1>
             <p className="text-muted-foreground max-w-xl text-base md:text-lg font-medium leading-relaxed">
               আপনার অবস্থানের সঠিক সেহরি ও ইফতারের সময় এবং রমজানের গুরুত্বপূর্ণ আমলসমূহ এখানে পাবেন ইনশাআল্লাহ।
             </p>
          </div>
          
          <div className="grid grid-cols-2 sm:flex gap-3 md:gap-4 w-full lg:w-auto">
             <div className="p-5 md:p-8 rounded-3xl md:rounded-4xl bg-secondary border border-border shadow-inner text-center flex-1 lg:min-w-[160px]">
                <Moon className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-2 md:mb-3" />
                <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase">আজকের রমজান</p>
                <h3 className="text-xl md:text-3xl font-black text-foreground dark:text-white">{currentRamadanDay ? `${currentRamadanDay.date.hijri.day}ই` : "---"}</h3>
             </div>
             <div className="p-5 md:p-8 rounded-3xl md:rounded-4xl bg-primary/10 border border-primary/20 text-center flex-1 lg:min-w-[160px]">
                <Sunrise className="h-6 w-6 md:h-8 md:w-8 text-amber-500 mx-auto mb-2 md:mb-3" />
                <p className="text-[10px] md:text-xs font-black text-primary/60 uppercase">বর্তমান আশরা</p>
                <h3 className="text-xl md:text-3xl font-black text-primary">{currentRamadanDay ? getAshra(parseInt(currentRamadanDay.date.hijri.day)).name : "আসছে"}</h3>
             </div>
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 h-64 md:h-96 w-64 md:w-96 bg-primary/20 blur-[80px] md:blur-[120px] rounded-full -mr-32 -mt-32 md:-mr-48 md:-mt-48" />
        <div className="absolute bottom-0 left-0 h-64 md:h-96 w-64 md:w-96 bg-emerald-500/10 blur-[80px] md:blur-[120px] rounded-full -ml-32 -mb-32 md:-ml-48 md:-mb-48" />
      </section>

      {/* Ramadan Duas Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
         <div className="group relative overflow-hidden p-6 md:p-8 rounded-3xl md:rounded-4xl bg-card border border-border shadow-sm hover:border-primary/30 transition-all duration-500 ring-1 ring-border">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
               <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen size={20} />
               </div>
               <h3 className="text-xl md:text-2xl font-black text-foreground dark:text-white">রোজার নিয়ত</h3>
            </div>
            <div className="space-y-4">
               <p className="text-lg md:text-xl font-serif text-zinc-300 leading-relaxed text-right md:text-left" dir="rtl">
                 نَوَيْتُ أَنْ أَصُومَ غَدًا مِّنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَّكَ يَا اللهُ فَتَقَبَّلْ مِنِّي إِنَّكَ أَنْته السَّمِيْعُ الْعَلِيْمُ
               </p>
               <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "হে আল্লাহ! আমি আগামীকাল পবিত্র রমজান মাসের তোমার পক্ষ থেকে নির্ধারিত ফরজ রোজা রাখার নিয়ত করছি। অতএব তুমি আমার পক্ষ থেকে তা কবুল কর। নিশ্চয়ই তুমি সর্বশ্রোতা ও সর্বজ্ঞ।"
                  </p>
               </div>
            </div>
         </div>

         <div className="group relative overflow-hidden p-6 md:p-8 rounded-3xl md:rounded-4xl bg-card border border-border shadow-sm hover:border-primary/30 transition-all duration-500 ring-1 ring-border">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
               <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sunset size={20} />
               </div>
               <h3 className="text-xl md:text-2xl font-black text-foreground dark:text-white">ইফতারের দোয়া</h3>
            </div>
            <div className="space-y-4">
               <p className="text-lg md:text-xl font-serif text-zinc-300 leading-relaxed text-right md:text-left" dir="rtl">
                 اَللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
               </p>
               <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "হে আল্লাহ! আমি তোমারই সন্তুষ্টির জন্য রোজা রেখেছি এবং তোমারই দেয়া রিযিক দিয়ে ইফতার করছি."
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Daily Schedule Section */}
      <section className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-2xl md:text-3xl font-black text-foreground dark:text-white flex items-center gap-3">
              <Star className="text-primary fill-primary/20" size={24} />
              রমজানের সময়সূচী
           </h2>
           <div className="hidden lg:flex gap-4">
             {["রহমত", "মাগফিরাত", "নাজাত"].map((name, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className={cn("h-2 w-2 rounded-full", i===0?"bg-emerald-500":i===1?"bg-sky-500":"bg-amber-500")} />
                   <span className=" font-black uppercase text-[10px] ">{name}</span>
                </div>
             ))}
           </div>
        </div>

        <div className="overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-card border border-border shadow-xl ring-1 ring-border">
           {/* Table Header */}
           <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 bg-secondary font-black uppercase text-muted-foreground border-b border-border">
              <div className="col-span-1">রমজান</div>
              <div className="col-span-3">তারিখ ও দিন</div>
              <div className="col-span-2">সেহরি শেষ</div>
              <div className="col-span-2 text-primary">ইফতার শুরু</div>
              <div className="col-span-2">আশরা</div>
              <div className="col-span-2 text-right">অবস্থা</div>
           </div>

           <div className="divide-y divide-border">
              {ramadanTimings?.map((day: any, index: number) => {
                const ramadanDay = parseInt(day.date.hijri.day)
                const ashra = getAshra(ramadanDay)
                const isToday = parseInt(day.date.gregorian.day) === todayDate && 
                            parseInt(day.date.gregorian.month.number.toString()) === todayMonth &&
                            parseInt(day.date.gregorian.year) === todayYear;
                
                // Show Ashra Header
                const showAshraHeader = ramadanDay === 1 || ramadanDay === 11 || ramadanDay === 21;

                return (
                  <React.Fragment key={index}>
                    {showAshraHeader && (
                      <div className={cn("px-6 md:px-8 py-3 bg-secondary flex items-center gap-3", ashra.bg)}>
                        <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full animate-pulse", ashra.color.replace('text-', 'bg-'))} />
                        <span className={cn("text-[10px] md:text-xs font-black uppercase", ashra.color)}>
                          {ashra.name} এর ১০ দিন
                        </span>
                      </div>
                    )}
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className={cn(
                        "grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-5 md:px-8 py-4 md:py-5 transition-all duration-300 group relative",
                        isToday ? "bg-primary/10" : "hover:bg-muted/50"
                      )}
                    >
                      {/* Mobile Layout (Visible only on small screens) */}
                      <div className="md:hidden flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <span className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                              {ramadanDay}
                           </span>
                           <div>
                              <p className="text-sm font-black text-foreground dark:text-white">{day.date.gregorian.day} {day.date.gregorian.month.en.substring(0, 3)}</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase">{day.date.gregorian.weekday.en.substring(0, 3)}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-muted-foreground uppercase">ইফতার</p>
                              <p className="text-base font-mono font-black text-primary">
                                 {formatTime12(day.timings.Maghrib.split(" ")[0])}
                              </p>
                           </div>
                           {isToday && <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]" />}
                        </div>
                      </div>

                      <div className="hidden md:block col-span-1 font-black text-lg text-muted-foreground group-hover:text-primary transition-colors">
                        {ramadanDay}
                      </div>

                      <div className="hidden md:block col-span-3">
                        <p className="text-sm font-black text-foreground dark:text-white">{day.date.gregorian.day} {day.date.gregorian.month.en}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{day.date.gregorian.weekday.en}</p>
                      </div>

                      <div className="hidden md:flex col-span-2 items-center gap-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-mono font-black text-foreground dark:text-white tracking-tighter">
                            {formatTime12(day.timings.Fajr.split(" ")[0])}
                          </span>
                        </div>
                      </div>

                      <div className="hidden md:flex col-span-2 items-center gap-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-mono font-black text-primary tracking-tighter">
                            {formatTime12(day.timings.Maghrib.split(" ")[0])}
                          </span>
                        </div>
                      </div>

                      {/* Mobile secondary info row */}
                      <div className="md:hidden flex items-center justify-between text-[10px] font-bold border-t border-border pt-2 mt-1">
                         <div className="flex items-center gap-2 text-muted-foreground uppercase">
                            <span>সেহরি শেষ:</span>
                            <span className="text-foreground dark:text-white font-mono">{formatTime12(day.timings.Fajr.split(" ")[0])}</span>
                         </div>
                         <div className={cn("px-2 py-0.5 rounded-full border", ashra.bg, ashra.color, ashra.border)}>
                             {ashra.name}
                         </div>
                      </div>

                      <div className="hidden md:block col-span-2">
                        <span className={cn("text-xs font-black uppercase px-3 py-1 rounded-full border", ashra.bg, ashra.color, ashra.border)}>
                          {ashra.name}
                        </span>
                      </div>

                      <div className="hidden md:block col-span-2 text-right">
                        {isToday ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-[10px] font-black text-white rounded-lg shadow-lg shadow-primary/20">
                             <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                             চলমান
                          </div>
                        ) : (
                          <span className="text-[10px] font-black  uppercase">
                             {currentRamadanDay && ramadanDay < parseInt(currentRamadanDay.date.hijri.day) ? "সম্পন্ন" : "আসছে"}
                          </span>
                        )}
                      </div>

                      {/* Today indicator line */}
                      {isToday && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(255,107,0,0.5)] hidden md:block" />}
                    </motion.div>
                  </React.Fragment>
                )
              })}
           </div>
        </div>
      </section>
      
      {/* Footer Info */}
      <footer className="p-6 md:p-8 rounded-3xl md:rounded-4xl bg-secondary border border-border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-sm ring-1 ring-border">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <Quote size={20} />
            </div>
            <p className="max-w-md text-xs md:text-sm text-muted-foreground italic font-medium">
              "রোজা ঢাল স্বরূপ, সুতরাং রোজা পালনকারী যেন অশ্লীল কথা না বলে এবং জাহেলী আচরণ না করে।" - (বুখারী ও মুসলিম)
            </p>
         </div>
         <div className="text-[10px] font-black text-muted-foreground/40 uppercase">
            Provided by Aladhan • Accurate for {city || "your current location"}
         </div>
      </footer>
    </div>
  )
}
