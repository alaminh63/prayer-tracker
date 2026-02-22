"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { Heart, Info, Banknote, Calculator, Users } from "lucide-react"

const COMMODITIES = [
  { id: "wheat", key: "commodity_wheat", rate: 115, icon: "🌾" },
  { id: "barley", key: "commodity_barley", rate: 400, icon: "🥖" },
  { id: "dates", key: "commodity_dates", rate: 2100, icon: "🌴" },
  { id: "raisins", key: "commodity_raisins", rate: 2700, icon: "🍇" },
  { id: "cheese", key: "commodity_cheese", rate: 2900, icon: "🧀" },
]

export function FitraCalculator() {
  const [familyMembers, setFamilyMembers] = useState<string>("1")
  const [selectedCommodity, setSelectedCommodity] = useState(COMMODITIES[0])
  const [totalFitra, setTotalFitra] = useState<number>(0)
  const [customRate, setCustomRate] = useState<string>("")
  const { t, language } = useTranslation()

  const currentRate = customRate ? parseFloat(customRate) : selectedCommodity.rate

  useEffect(() => {
    const total = parseFloat(familyMembers || "0") * currentRate
    setTotalFitra(total)
  }, [familyMembers, currentRate])

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full  mx-auto items-start pb-20">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-7 flex flex-col gap-8 w-full">
        <div className="p-8 md:p-10 bg-card border border-border rounded-3xl md:rounded-4xl shadow-xl relative overflow-hidden group ring-1 ring-border/5">
          <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-5 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-2xl">
              <Heart className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground dark:text-white leading-none">{t.calculators.fitra_title}</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase mt-2">{t.calculators.fitra_guide}</p>
            </div>
          </div>

          <div className="grid gap-10 relative z-10">
            {/* Family Members Input */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-emerald-400 uppercase flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                  <Users className="h-4 w-4" />
                </div>
                {t.calculators.fitra_family}
              </label>
              <div className="relative group">
                 <input 
                  type="number" 
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-2xl px-8 py-5 text-foreground dark:text-white focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-black text-3xl tabular-nums shadow-sm"
                  placeholder="১"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/30 uppercase pointer-events-none group-focus-within:text-emerald-500 transition-all duration-500">
                  {language === "bn" ? "জন সদস্য" : "Persons"}
                </span>
              </div>
            </div>

            {/* Commodity Selection Grid */}
            <div className="space-y-6">
              <label className="text-[11px] font-black text-primary uppercase flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
                  <Banknote className="h-4 w-4" />
                </div>
                {t.calculators.fitra_amount} <span className="text-[9px] opacity-60 ml-2 font-bold italic">(২০২৬ প্রাক্কলিত)</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {COMMODITIES.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => {
                       setSelectedCommodity(item)
                       setCustomRate("")
                     }}
                     className={cn(
                       "flex flex-col gap-4 p-5 rounded-2xl border-2 transition-all duration-500 text-left relative overflow-hidden group/btn",
                       selectedCommodity.id === item.id && !customRate
                         ? "bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                         : "bg-secondary border-border hover:border-primary/20"
                     )}
                   >
                     {selectedCommodity.id === item.id && !customRate && (
                       <div className="absolute top-0 right-0 p-3">
                         <div className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
                       </div>
                     )}
                     <div className="flex items-center justify-between w-full relative z-10 font-[inherit]">
                        <span className="text-3xl transition-transform group-hover/btn:scale-110 duration-700">{item.icon}</span>
                         <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className={cn("text-[10px] font-black", selectedCommodity.id === item.id && !customRate ? "text-white/60" : "text-muted-foreground/30")}>৳</span>
                            <span className={cn("text-xl md:text-2xl font-black tabular-nums", selectedCommodity.id === item.id && !customRate ? "text-white" : "text-foreground group-hover/btn:text-primary")}>{item.rate}</span>
                          </div>
                        </div>
                     </div>
                     <span className={cn(
                       "text-[10px] md:text-[11px] font-black uppercase relative z-10 block mt-1",
                       selectedCommodity.id === item.id && !customRate ? "text-white" : "text-muted-foreground"
                     )}>{t.calculators[item.key as keyof typeof t.calculators]}</span>
                   </button>
                 ))}
              </div>

              {/* Custom Rate Optional */}
              <div className="pt-4">
                 <div className="relative group/custom">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-500 group-focus-within/custom:text-primary">
                      <span className="text-lg font-black text-muted-foreground/20">৳</span>
                    </div>
                    <input 
                       type="number" 
                       value={customRate}
                       onChange={(e) => setCustomRate(e.target.value)}
                       placeholder={language === "bn" ? "নিজস্ব হার ব্যবহার করুন (ঐচ্ছিক)" : "Use custom rate (optional)"}
                       className="w-full bg-secondary border border-border rounded-xl md:rounded-2xl px-12 py-5 text-sm md:text-base text-foreground dark:text-white focus:outline-hidden focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-black placeholder:text-muted-foreground/20 placeholder:uppercase placeholder:text-[9px]"
                     />
                     <div className={cn(
                       "absolute right-5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full transition-all duration-700",
                       customRate ? "bg-primary shadow-[0_0_15px_#ff6b00] scale-110" : "bg-zinc-900 border border-white/5"
                     )} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Result Summary */}
      <div className="lg:col-span-5 flex flex-col gap-6 w-full lg:sticky lg:top-8">
        {/* Result Card - Ultra High Contrast */}
        <div className="p-12 bg-linear-to-br from-emerald-600 to-teal-700 rounded-4xl shadow-xl relative overflow-hidden group border border-white/10">
          <div className="absolute top-0 right-0 p-12 opacity-15 grayscale brightness-200 group-hover:scale-135 transition-transform duration-1000 rotate-12 group-hover:rotate-0">
            <Calculator className="h-64 w-64" />
          </div>
          
          <div className="relative z-10 text-center space-y-10">
            <p className="text-xs font-bold text-white/80 uppercase">{t.calculators.fitra_total}</p>
            <div className="flex flex-col items-center justify-center">
               <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-white/40">৳</span>
                  <h3 className="text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">
                   {totalFitra.toLocaleString()}
                  </h3>
               </div>
            </div>
            <div className="space-y-8">
               <div className="h-2 w-32 bg-white/20 mx-auto rounded-full" />
               <div className="flex items-start gap-4 p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
                 <Info className="h-6 w-6 text-white/60 shrink-0 mt-1" />
                 <p className="text-[11px] font-bold text-white/90 leading-relaxed italic text-left">
                   {language === "bn" 
                     ? "রমজানের শেষে ইসলামিক ফাউন্ডেশন কর্তৃক ঘোষিত চূড়ান্ত হার যাচাই করে নিন। এই হিসাবটি কেবলমাত্র একটি আনুমানিক ধারণা প্রদান করে।" 
                     : "Please verify the final rates announced by the Islamic Foundation at the end of Ramadan. This calculation provides an estimate only."}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-10 bg-secondary/30 border border-border rounded-4xl">
           <div className="flex items-center gap-4 mb-6">
              <div className="h-1px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
              <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest whitespace-nowrap">Important Note</p>
              <div className="h-1px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
           </div>
           <p className="text-[10px] font-bold text-muted-foreground text-center leading-loose">
             ফিতরা বা সদাকাতুল ফিতর প্রদানের সময় বর্তমান বাজার দর অনুযায়ী উত্তম খাদ্যশস্যের মূল্য বিবেচনা করার চেষ্টা করুন।
           </p>
        </div>
      </div>
    </div>
  )
}
