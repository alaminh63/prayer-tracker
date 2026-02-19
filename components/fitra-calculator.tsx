"use client"

import React, { useState, useEffect } from "react"
import { Heart, Info, Calculator, Banknote } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

const COMMODITIES = [
  { id: "wheat", rate: 115, icon: "🌾", key: "commodity_wheat" },
  { id: "barley", rate: 400, icon: "🌾", key: "commodity_barley" },
  { id: "dates", rate: 2000, icon: "🌴", key: "commodity_dates" },
  { id: "raisins", rate: 1700, icon: "🍇", key: "commodity_raisins" },
  { id: "cheese", rate: 2700, icon: "🧀", key: "commodity_cheese" },
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
    <div className="flex flex-col gap-8 w-full">
      <div className="p-8 bg-zinc-950/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl">
            <Heart className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t.calculators.fitra_title}</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t.calculators.fitra_guide}</p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Family Members Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Info className="h-3 w-3" />
              {t.calculators.fitra_family}
            </label>
            <div className="relative">
               <input 
                type="number" 
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all font-black text-xl"
                placeholder="১"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600 uppercase">ব্যক্তি</span>
            </div>
          </div>

          {/* Commodity Selection Grid */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Banknote className="h-3 w-3" />
              {t.calculators.fitra_amount} (২০২৬ এর প্রাক্কলিত হার)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {COMMODITIES.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => {
                     setSelectedCommodity(item)
                     setCustomRate("")
                   }}
                   className={cn(
                     "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                     selectedCommodity.id === item.id && !customRate
                       ? "bg-primary/10 border-primary/40 shadow-lg"
                       : "bg-white/5 border-transparent hover:border-white/10"
                   )}
                 >
                   <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className={cn(
                        "text-xs font-bold",
                        selectedCommodity.id === item.id && !customRate ? "text-primary" : "text-zinc-400"
                      )}>{t.calculators[item.key as keyof typeof t.calculators]}</span>
                   </div>
                   <span className="text-xs font-black text-white">৳{item.rate}</span>
                 </button>
               ))}
            </div>

            {/* Custom Rate Optional */}
            <div className="pt-2">
               <div className="relative">
                 <input 
                    type="number" 
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    placeholder={language === "bn" ? "নিজে হার বসান (ঐচ্ছিক)" : "Custom rate (optional)"}
                    className="w-full bg-white/5 border border-dashed border-white/10 rounded-2xl px-5 py-3 text-xs text-white focus:outline-hidden focus:border-primary/40 transition-all"
                  />
                  {customRate && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-10 bg-primary rounded-[3rem] shadow-[0_0_50px_rgba(255,107,0,0.25)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
          <Calculator className="h-40 w-40" />
        </div>
        
        <div className="relative z-10 text-center space-y-3">
          <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em]">{t.calculators.fitra_total}</p>
          <div className="flex items-center justify-center gap-2">
             <span className="text-2xl font-black text-white/60 mb-1">৳</span>
             <h3 className="text-6xl md:text-7xl font-black text-white tracking-tighter">
              {totalFitra.toLocaleString()}
             </h3>
          </div>
          <div className="h-1 w-20 bg-white/20 mx-auto rounded-full mt-6 mb-4" />
          <p className="text-[10px] font-bold text-white/70 max-w-[260px] mx-auto leading-relaxed italic">
            {language === "bn" 
              ? "রমজানের শেষে ইসলামিক ফাউন্ডেশন কর্তৃক ঘোষিত চূড়ান্ত হার যাচাই করে নিন।" 
              : "Verify the final rates announced by the Islamic Foundation at the end of Ramadan."}
          </p>
        </div>
      </div>
    </div>
  )
}
