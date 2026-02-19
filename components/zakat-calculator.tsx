"use client"

import React, { useState, useEffect } from "react"
import { Calculator, Coins, TrendingUp, Landmark, Briefcase, ChevronRight, Info } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

export function ZakatCalculator() {
  const [goldPrice, setGoldPrice] = useState<number>(8500)
  const [silverPrice, setSilverPrice] = useState<number>(110)
  const [isFetching, setIsFetching] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [calculationMode, setCalculationMode] = useState<"lunar" | "solar">("lunar")

  // Assets
  const [gold, setGold] = useState<string>("")
  const [cash, setCash] = useState<string>("")
  const [investments, setInvestments] = useState<string>("")
  const [businessAssets, setBusinessAssets] = useState<string>("")
  const [receivables, setReceivables] = useState<string>("")

  // Liabilities
  const [debts, setDebts] = useState<string>("")
  const [expenses, setExpenses] = useState<string>("")

  const [totalZakat, setTotalZakat] = useState<number>(0)
  const [totalAssets, setTotalAssets] = useState<number>(0)
  const [totalLiabilities, setTotalLiabilities] = useState<number>(0)
  const [netAssets, setNetAssets] = useState<number>(0)
  
  const { t, language } = useTranslation()

  // Nisab Calculation constants (2026 perspective)
  const GOLD_NISAB_GRAMS = 87.48 // 7.5 Tola
  const SILVER_NISAB_GRAMS = 595 // 52.5 Tola (Common standard)

  const goldNisabAmount = GOLD_NISAB_GRAMS * goldPrice
  const silverNisabAmount = SILVER_NISAB_GRAMS * silverPrice
  
  // defaulting to Silver Standard as per user's request (goribder upokarer kotha chinta kore)
  const activeNisab = silverNisabAmount

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    setIsFetching(true)
    try {
      const res = await fetch("https://api.metals.dev/v1/latest?api_key=FREE_KEY&currency=BDT&unit=g")
      if (res.ok) {
        const data = await res.json()
        if (data.rates?.XAU) setGoldPrice(data.rates.XAU)
        if (data.rates?.XAG) setSilverPrice(data.rates.XAG)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } catch (error) {
       console.error("Failed to fetch prices")
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    const assets = 
      parseFloat(gold || "0") + 
      parseFloat(cash || "0") + 
      parseFloat(investments || "0") + 
      parseFloat(businessAssets || "0") +
      parseFloat(receivables || "0")
    
    const liabs = 
      parseFloat(debts || "0") + 
      parseFloat(expenses || "0")

    const net = assets - liabs
    const percentage = calculationMode === "lunar" ? 0.025 : 0.02583
    
    setTotalAssets(assets)
    setTotalLiabilities(liabs)
    setNetAssets(net)
    setTotalZakat(net >= activeNisab ? net * percentage : 0)
  }, [gold, cash, investments, businessAssets, receivables, debts, expenses, activeNisab, calculationMode])

  const isEligible = netAssets >= activeNisab

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-start pb-20">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-7 flex flex-col gap-8 w-full">
        {/* Real-time Prices & Mode Toggle */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 bg-zinc-900/60 border border-white/10 rounded-4xl backdrop-blur-3xl shadow-2xl">
             <div className="flex flex-col gap-2">
               <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                 {t.calculators.zakat_year_type}
               </p>
               <p className="text-xs text-zinc-400 font-bold leading-relaxed">হিসাবের জন্য বছর নির্বাচন করুন</p>
             </div>
             <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-white/10 shadow-inner">
               <button 
                 onClick={() => setCalculationMode("lunar")}
                 className={cn(
                   "px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                   calculationMode === "lunar" ? "bg-primary text-white shadow-[0_0_25px_rgba(255,107,0,0.4)]" : "text-zinc-600 hover:text-white"
                 )}
               >
                 {t.calculators.lunar_year}
               </button>
               <button 
                 onClick={() => setCalculationMode("solar")}
                 className={cn(
                   "px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                   calculationMode === "solar" ? "bg-primary text-white shadow-[0_0_25px_rgba(255,107,0,0.4)]" : "text-zinc-600 hover:text-white"
                 )}
               >
                 {t.calculators.solar_year}
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PriceCard label="Gold (1g)" price={goldPrice} icon={<Coins className="text-amber-400" />} />
            <PriceCard label="Silver (1g)" price={silverPrice} icon={<Coins className="text-zinc-300" />} />
          </div>
        </div>

        {/* Main Form Area */}
        <div className="p-10 bg-zinc-950/40 border border-white/10 rounded-4xl shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
          <div className="absolute top-0 right-0 h-96 w-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-2xl scale-110">
                <Calculator className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-none">{t.calculators.zakat_title}</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase mt-2">{t.calculators.zakat_guide}</p>
              </div>
            </div>
            <button 
              onClick={fetchPrices} 
              disabled={isFetching} 
              className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-zinc-400 transition-all font-black text-[10px] uppercase tracking-widest group/btn"
            >
              <TrendingUp size={16} className={cn("transition-transform", isFetching ? "animate-spin" : "group-hover/btn:scale-125")} />
              আপডেট
            </button>
          </div>

          <div className="space-y-14">
            {/* Assets Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                 <span className="text-xs font-black text-primary uppercase whitespace-nowrap">১. যাকাতযোগ্য সম্পদ</span>
                 <div className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent" />
              </div>
              <div className="grid gap-8">
                <InputField label={t.calculators.zakat_gold_silver} icon={<Coins className="h-5 w-5" />} value={gold} onChange={setGold} placeholder="৳ ০.০০" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label={t.calculators.zakat_cash} icon={<Landmark className="h-5 w-5" />} value={cash} onChange={setCash} placeholder="৳ ০.০০" />
                  <InputField label={t.calculators.zakat_receivables} icon={<ChevronRight className="h-5 w-5" />} value={receivables} onChange={setReceivables} placeholder="৳ ০.০০" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label={t.calculators.zakat_investments} icon={<TrendingUp className="h-5 w-5" />} value={investments} onChange={setInvestments} placeholder="৳ ০.০০" />
                  <InputField label={t.calculators.zakat_business} icon={<Briefcase className="h-5 w-5" />} value={businessAssets} onChange={setBusinessAssets} placeholder="৳ ০.০০" />
                </div>
              </div>
            </section>

            {/* Liabilities Section */}
            <section className="space-y-8 pb-4">
              <div className="flex items-center gap-4">
                 <span className="text-xs font-black text-rose-500 uppercase whitespace-nowrap">{t.calculators.zakat_liabilities_title}</span>
                 <div className="h-px flex-1 bg-linear-to-r from-rose-500/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label={t.calculators.zakat_debts} icon={<ChevronRight className="h-5 w-5 text-rose-500" />} value={debts} onChange={setDebts} placeholder="৳ ০.০০" isDanger />
                <InputField label={t.calculators.zakat_expenses} icon={<ChevronRight className="h-5 w-5 text-rose-500" />} value={expenses} onChange={setExpenses} placeholder="৳ ০.০০" isDanger />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Right Column: Summary & Results */}
      <div className="lg:col-span-5 flex flex-col gap-6 w-full lg:sticky lg:top-8">
        {/* Nisab Status Card */}
        <div className={cn(
          "p-10 rounded-4xl border transition-all duration-700 flex flex-col gap-8 shadow-2xl relative overflow-hidden",
          isEligible ? "bg-emerald-500/5 border-emerald-500/20" : "bg-zinc-950/40 border-white/5"
        )}>
          {isEligible && (
            <div className="absolute -top-12 -right-12 h-48 w-48 bg-emerald-500/10 blur-[60px] rounded-full" />
          )}
          
          <div className="flex flex-col gap-6 relative z-10">
             <div className="flex items-center gap-4">
               <div className={cn(
                 "h-3 w-3 rounded-full animate-pulse shadow-[0_0_15px_currentColor]",
                 isEligible ? "text-emerald-500 bg-emerald-500" : "text-zinc-600 bg-zinc-600"
               )} />
               <p className="text-xs font-bold uppercase text-zinc-500">{t.calculators.nisab_status}</p>
             </div>
             
             <div className="space-y-2">
               <p className="text-xs font-bold text-zinc-400">নিসাবের হার (রুপা):</p>
               <h4 className="text-4xl font-black text-white tracking-tighter tabular-nums">৳{activeNisab.toLocaleString()}</h4>
             </div>
          </div>

          <div className="relative z-10">
            <div className={cn(
              "text-xs font-black px-8 py-5 rounded-2xl border uppercase text-center transition-all duration-700",
              isEligible 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.1)]" 
                : "bg-white/5 border-white/10 text-zinc-600"
            )}>
              {isEligible ? t.calculators.nisab_eligible : t.calculators.nisab_not_eligible}
            </div>
            {!isEligible && netAssets > 0 && (
              <p className="text-xs text-zinc-500 font-bold mt-4 text-center leading-relaxed">
                আপনার নিট সম্পদ নিসাবের চেয়ে কম। <br/>
                নিসাব পূর্ণ হতে আরও <span className="text-primary">৳{(activeNisab - netAssets).toLocaleString()}</span> প্রয়োজন।
              </p>
            )}
          </div>
        </div>

        {/* Result Card - High Contrast */}
        <div className={cn(
          "p-12 rounded-4xl border transition-all duration-1000 relative overflow-hidden group shadow-2xl",
          isEligible 
            ? "bg-linear-to-br from-primary to-orange-600 border-white/10" 
            : "bg-zinc-900/50 border-white/5 opacity-40"
        )}>
          <div className="absolute top-0 right-0 p-12 opacity-15 rotate-12 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-0 brightness-200">
            <Landmark size={220} />
          </div>
          
          <div className="relative z-10 text-center space-y-10">
            <p className={cn(
              "text-xs font-bold uppercase transition-colors duration-1000",
              isEligible ? "text-white/80" : "text-zinc-600"
            )}>{t.calculators.zakat_payable}</p>
            
            <div className="flex flex-col items-center justify-center">
               <div className="flex items-center gap-4">
                  <span className={cn("text-4xl font-black transition-colors duration-1000", isEligible ? "text-white/40" : "text-zinc-800")}>৳</span>
                  <h3 className={cn(
                    "text-7xl md:text-8xl font-black tracking-tighter transition-colors duration-1000 leading-none drop-shadow-2xl",
                    isEligible ? "text-white" : "text-zinc-800"
                  )}>
                    {totalZakat.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </h3>
               </div>
            </div>

            <div className="space-y-6">
               <div className={cn(
                 "h-2 w-32 mx-auto rounded-full transition-colors duration-1000",
                 isEligible ? "bg-white/20" : "bg-zinc-800"
               )} />
               <p className={cn(
                 "text-[11px] font-bold max-w-xs mx-auto leading-relaxed transition-colors duration-1000",
                 isEligible ? "text-white/90" : "text-zinc-700"
               )}>
                 {t.calculators.zakat_formula} <br/>
                 <span className="text-[9px] opacity-60 font-black uppercase mt-2 block">বর্ষ: {calculationMode === 'lunar' ? 'হিজরি' : 'ইংরেজি'}</span>
               </p>
            </div>
          </div>
        </div>

        {/* Note/Info Section */}
        <div className="p-10 bg-zinc-950/20 border border-white/5 rounded-4xl space-y-8">
          <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
            <Info size={18} className="text-primary shrink-0 mt-1" />
            <p className="text-xs font-bold leading-relaxed text-zinc-400 italic">
              {t.calculators.zakat_note}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] tabular-nums">
               {lastUpdated && `Last Sync: ${lastUpdated}`}
             </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PriceCard({ label, price, icon }: { label: string, price: number, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-zinc-900 border border-white/10 rounded-[2rem] relative overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-xl">
      <div className="absolute -right-4 -top-4 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-175 group-hover:rotate-0 duration-1000">
        {icon}
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-white tabular-nums tracking-tighter">৳{price.toLocaleString()}</span>
        <span className="text-xs text-zinc-600 font-black uppercase tracking-widest">BDT/G</span>
      </div>
    </div>
  )
}

function InputField({ label, icon, value, onChange, placeholder, isDanger }: { 
  label: string, 
  icon: React.ReactNode, 
  value: string, 
  onChange: (v: string) => void,
  placeholder: string,
  isDanger?: boolean
}) {
  return (
    <div className="space-y-3">
      <label className="text-[11px] font-black text-zinc-400 flex items-center gap-2.5 uppercase transition-colors group-focus-within:text-primary">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
          isDanger ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-white/5 text-zinc-500 border border-white/10 group-focus-within:bg-primary/10 group-focus-within:text-primary group-focus-within:border-primary/20"
        )}>
          {icon}
        </div>
        {label}
      </label>
      <div className="relative group/input">
        <input 
          type="number" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-zinc-900 border px-6 py-5 text-lg focus:outline-hidden transition-all duration-500 font-black tracking-tight rounded-[1.25rem] tabular-nums",
            isDanger 
              ? "border-rose-500/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-500 placeholder:text-rose-900/40" 
              : "border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10 text-white placeholder:text-zinc-800"
          )}
        />
        <div className={cn(
          "absolute right-6 top-1/2 -translate-y-1/2 text-[11px] font-black pointer-events-none transition-all duration-500 tabular-nums uppercase",
          isDanger ? "text-rose-900" : "text-zinc-800 group-focus-within/input:text-primary"
        )}>BDT</div>
      </div>
    </div>
  )
}
