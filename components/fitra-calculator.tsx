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
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-start pb-20">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-7 flex flex-col gap-8 w-full">
        <div className="p-10 bg-zinc-950/40 border border-white/10 rounded-4xl shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
          <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-6 mb-12">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-2xl scale-110">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none">{t.calculators.fitra_title}</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase mt-2">{t.calculators.fitra_guide}</p>
            </div>
          </div>

          <div className="grid gap-14 relative z-10">
            {/* Family Members Input */}
            <div className="space-y-6">
              <label className="text-xs font-black text-emerald-400 uppercase flex items-center gap-4">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                  <Users className="h-5 w-5" />
                </div>
                {t.calculators.fitra_family}
              </label>
              <div className="relative group">
                 <input 
                  type="number" 
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-white/5 rounded-3xl px-10 py-8 text-white focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-black text-5xl tabular-nums shadow-2xl"
                  placeholder="১"
                />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-sm font-black text-zinc-700 uppercase tracking-widest pointer-events-none group-focus-within:text-emerald-500 transition-all duration-500">
                  {language === "bn" ? "জন সদস্য" : "Persons"}
                </span>
              </div>
            </div>

            {/* Commodity Selection Grid */}
            <div className="space-y-8">
              <label className="text-xs font-black text-primary uppercase flex items-center gap-4">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
                  <Banknote className="h-5 w-5" />
                </div>
                {t.calculators.fitra_amount} <span className="text-[9px] opacity-60 ml-2 font-bold tracking-normal italic">(২০২৬ প্রাক্কলিত)</span>
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
                       "flex flex-col gap-5 p-6 rounded-3xl border-2 transition-all duration-500 text-left relative overflow-hidden group/btn",
                       selectedCommodity.id === item.id && !customRate
                         ? "bg-emerald-600 border-emerald-400 shadow-[0_15px_40px_rgba(16,185,129,0.3)] scale-102"
                         : "bg-zinc-900 border-white/5 hover:border-white/20"
                     )}
                   >
                     {selectedCommodity.id === item.id && !customRate && (
                       <div className="absolute top-0 right-0 p-4">
                         <div className="h-2 w-2 bg-white rounded-full animate-ping" />
                       </div>
                     )}
                     <div className="flex items-center justify-between w-full relative z-10">
                        <span className="text-4xl transition-transform group-hover/btn:scale-125 duration-700">{item.icon}</span>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className={cn("text-xs font-black", selectedCommodity.id === item.id && !customRate ? "text-white/60" : "text-zinc-700")}>৳</span>
                            <span className={cn("text-2xl font-black tabular-nums tracking-tighter", selectedCommodity.id === item.id && !customRate ? "text-white" : "text-zinc-400 group-hover/btn:text-white")}>{item.rate}</span>
                          </div>
                          <span className={cn("text-xs font-bold uppercase mt-1", selectedCommodity.id === item.id && !customRate ? "text-white/40" : "text-zinc-800")}>PER PERSON</span>
                        </div>
                     </div>
                     <span className={cn(
                       "text-[11px] font-black uppercase relative z-10 block mt-2",
                       selectedCommodity.id === item.id && !customRate ? "text-white" : "text-zinc-500 group-hover/btn:text-white"
                     )}>{t.calculators[item.key as keyof typeof t.calculators]}</span>
                   </button>
                 ))}
              </div>

              {/* Custom Rate Optional */}
              <div className="pt-6">
                 <div className="relative group/custom">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-500 group-focus-within/custom:text-primary">
                     <span className="text-xl font-black text-zinc-800">৳</span>
                   </div>
                   <input 
                      type="number" 
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder={language === "bn" ? "নিজস্ব হার ব্যবহার করুন (ঐচ্ছিক)" : "Use custom rate (optional)"}
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-14 py-6 text-base text-white focus:outline-hidden focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-black placeholder:text-zinc-800 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                    />
                    <div className={cn(
                      "absolute right-6 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full transition-all duration-700",
                      customRate ? "bg-primary shadow-[0_0_20px_#ff6b00] scale-125" : "bg-zinc-900 border border-white/5"
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
        <div className="p-12 bg-linear-to-br from-emerald-600 to-teal-700 rounded-4xl shadow-[0_40px_100px_rgba(16,185,129,0.3)] relative overflow-hidden group border border-white/20">
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
        <div className="p-10 bg-zinc-900/40 border border-white/5 rounded-4xl">
           <div className="flex items-center gap-4 mb-6">
              <div className="h-1px flex-1 bg-linear-to-r from-transparent via-white/5 to-transparent" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest whitespace-nowrap">Important Note</p>
              <div className="h-1px flex-1 bg-linear-to-r from-transparent via-white/5 to-transparent" />
           </div>
           <p className="text-[10px] font-bold text-zinc-500 text-center leading-loose">
             ফিতরা বা সদাকাতুল ফিতর প্রদানের সময় বর্তমান বাজার দর অনুযায়ী উত্তম খাদ্যশস্যের মূল্য বিবেচনা করার চেষ্টা করুন।
           </p>
        </div>
      </div>
    </div>
  )
}
