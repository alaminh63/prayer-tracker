"use client"

import React, { useState, useEffect } from "react"
import { Calculator, Coins, TrendingUp, Landmark, Briefcase, ChevronRight } from "lucide-react"
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
    <div className="flex flex-col gap-6 w-full">
      {/* Real-time Prices & Mode Toggle */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
             {t.calculators.zakat_year_type}
           </p>
           <div className="flex bg-zinc-950/50 p-1 rounded-xl border border-white/5">
             <button 
               onClick={() => setCalculationMode("lunar")}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                 calculationMode === "lunar" ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
               )}
             >
               {t.calculators.lunar_year}
             </button>
             <button 
               onClick={() => setCalculationMode("solar")}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                 calculationMode === "solar" ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
               )}
             >
               {t.calculators.solar_year}
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PriceCard label="Gold (1g)" price={goldPrice} icon={<Coins className="text-yellow-500" />} />
          <PriceCard label="Silver (1g)" price={silverPrice} icon={<Coins className="text-zinc-400" />} />
        </div>
      </div>

      <div className="p-8 bg-zinc-950/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Calculator className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{t.calculators.zakat_title}</h2>
              <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">{t.calculators.zakat_guide}</p>
            </div>
          </div>
          <button onClick={fetchPrices} disabled={isFetching} className="p-3 bg-white/5 rounded-xl text-zinc-400">
            <TrendingUp size={18} className={cn(isFetching && "animate-pulse")} />
          </button>
        </div>

        <div className="space-y-10">
          {/* Assets Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-px flex-1 bg-white/5" />
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">১. যাকাতযোগ্য সম্পদ</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid gap-6">
              <InputField label={t.calculators.zakat_gold_silver} icon={<Coins className="h-4 w-4" />} value={gold} onChange={setGold} placeholder="৳ ০.০০" />
              <InputField label={t.calculators.zakat_cash} icon={<Landmark className="h-4 w-4" />} value={cash} onChange={setCash} placeholder="৳ ০.০০" />
              <InputField label={t.calculators.zakat_receivables} icon={<ChevronRight className="h-4 w-4" />} value={receivables} onChange={setReceivables} placeholder="৳ ০.০০" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label={t.calculators.zakat_investments} icon={<TrendingUp className="h-4 w-4" />} value={investments} onChange={setInvestments} placeholder="৳ ০.০০" />
                <InputField label={t.calculators.zakat_business} icon={<Briefcase className="h-4 w-4" />} value={businessAssets} onChange={setBusinessAssets} placeholder="৳ ০.০০" />
              </div>
            </div>
          </section>

          {/* Liabilities Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-px flex-1 bg-white/5" />
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">{t.calculators.zakat_liabilities_title}</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label={t.calculators.zakat_debts} icon={<ChevronRight className="h-4 w-4 text-rose-500" />} value={debts} onChange={setDebts} placeholder="৳ ০.০০" isDanger />
              <InputField label={t.calculators.zakat_expenses} icon={<ChevronRight className="h-4 w-4 text-rose-500" />} value={expenses} onChange={setExpenses} placeholder="৳ ০.০০" isDanger />
            </div>
          </section>
        </div>

        {/* Nisab Status */}
        <div className="mt-12 p-6 rounded-3xl bg-zinc-950/50 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className={cn(
               "h-3 w-3 rounded-full shadow-[0_0_15px_currentColor]",
               isEligible ? "text-emerald-500 bg-emerald-500" : "text-zinc-600 bg-zinc-600"
             )} />
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t.calculators.nisab_status}</p>
               <p className="text-xs font-bold text-white/50">নিসাবের হার: ৳{activeNisab.toLocaleString()}</p>
             </div>
          </div>
          <span className={cn(
            "text-xs font-black px-6 py-2 rounded-full border",
            isEligible 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
              : "bg-white/5 border-white/5 text-zinc-600"
          )}>
            {isEligible ? t.calculators.nisab_eligible : t.calculators.nisab_not_eligible}
          </span>
        </div>
      </div>

      {/* Final Result */}
      <div className={cn(
        "p-10 rounded-[3rem] border transition-all duration-1000 relative overflow-hidden group",
        isEligible 
          ? "bg-primary border-primary shadow-[0_30px_100px_rgba(255,107,0,0.25)]" 
          : "bg-zinc-950/40 border-white/5 grayscale opacity-40 shadow-none"
      )}>
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000">
          <Landmark size={180} />
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <p className={cn(
            "text-[10px] font-black uppercase tracking-[0.5em]",
            isEligible ? "text-white/80" : "text-zinc-600"
          )}>{t.calculators.zakat_payable}</p>
          <div className="flex items-center justify-center gap-2">
             <span className={cn("text-3xl font-black", isEligible ? "text-white/60" : "text-zinc-700")}>৳</span>
             <h3 className={cn(
               "text-7xl md:text-8xl font-black tracking-tighter",
               isEligible ? "text-white" : "text-zinc-600"
             )}>
              {totalZakat.toLocaleString(undefined, { maximumFractionDigits: 0 })}
             </h3>
          </div>
          <div className="flex flex-col gap-2 items-center">
             <div className="h-1 w-24 bg-white/20 rounded-full" />
             <p className={cn(
               "text-[11px] font-bold max-w-[320px] mx-auto opacity-70 leading-relaxed",
               isEligible ? "text-white" : "text-zinc-600"
             )}>
               {t.calculators.zakat_formula} (হিসাব বর্ষ: {calculationMode === 'lunar' ? 'হিজরি' : 'ইংরেজি'})
             </p>
          </div>
        </div>
      </div>

      <div className="p-8 text-center space-y-4">
        <p className="text-[10px] text-zinc-500 font-bold leading-relaxed px-10">
          {t.calculators.zakat_note}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
           <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
             {lastUpdated && `Last Updated: ${lastUpdated}`}
           </span>
        </div>
      </div>
    </div>
  )
}

function PriceCard({ label, price, icon }: { label: string, price: number, icon: React.ReactNode }) {
  return (
    <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute -right-2 -top-2 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-175 duration-700">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
      <div className="flex items-end gap-1">
        <span className="text-xl font-black text-white">৳{price.toLocaleString()}</span>
        <span className="text-[10px] text-zinc-500 mb-1 font-bold">BDT</span>
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
    <div className="space-y-2.5">
      <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
        {icon}
        {label}
      </label>
      <div className="relative group">
        <input 
          type="number" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-zinc-900/50 border rounded-2xl px-5 py-4 text-sm focus:outline-hidden transition-all font-bold",
            isDanger 
              ? "border-rose-500/10 focus:ring-2 focus:ring-rose-500/20 text-rose-500" 
              : "border-white/5 focus:ring-2 focus:ring-primary/40 text-white"
          )}
        />
        <div className={cn(
          "absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black pointer-events-none transition-colors",
          isDanger ? "text-rose-900" : "text-zinc-700 group-focus-within:text-primary/40"
        )}>BDT</div>
      </div>
    </div>
  )
}
