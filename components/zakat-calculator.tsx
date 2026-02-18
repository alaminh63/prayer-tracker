"use client"

import React, { useState, useEffect } from "react"
import { Calculator, Coins, TrendingUp, Landmark, Briefcase } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export function ZakatCalculator() {
  const [gold, setGold] = useState<string>("")
  const [silver, setSilver] = useState<string>("")
  const [cash, setCash] = useState<string>("")
  const [investments, setInvestments] = useState<string>("")
  const [businessAssets, setBusinessAssets] = useState<string>("")
  const [totalZakat, setTotalZakat] = useState<number>(0)
  const { t, language } = useTranslation()

  useEffect(() => {
    const total = 
      (parseFloat(gold || "0") + 
       parseFloat(silver || "0") + 
       parseFloat(cash || "0") + 
       parseFloat(investments || "0") + 
       parseFloat(businessAssets || "0")) * 0.025
    
    setTotalZakat(total)
  }, [gold, silver, cash, investments, businessAssets])

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 glass-card bg-linear-to-br from-primary/10 to-transparent">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.calculators.zakat_title}</h2>
            <p className="text-xs text-muted-foreground">{t.calculators.zakat_guide}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <InputField 
            label={t.calculators.zakat_gold_silver} 
            icon={<Coins className="h-4 w-4" />} 
            value={gold} 
            onChange={setGold} 
            placeholder={language === "bn" ? "সোনা/রূপার মূল্য" : "Value of your gold/silver"}
          />
          <InputField 
            label={t.calculators.zakat_cash} 
            icon={<Landmark className="h-4 w-4" />} 
            value={cash} 
            onChange={setCash} 
            placeholder={language === "bn" ? "মোট নগদ টাকা" : "Total cash amount"}
          />
          <InputField 
            label={t.calculators.zakat_investments} 
            icon={<TrendingUp className="h-4 w-4" />} 
            value={investments} 
            onChange={setInvestments} 
            placeholder={language === "bn" ? "বিনিয়োগের বাজার মূল্য" : "Market value of investments"}
          />
          <InputField 
            label={t.calculators.zakat_business} 
            icon={<Briefcase className="h-4 w-4" />} 
            value={businessAssets} 
            onChange={setBusinessAssets} 
            placeholder={language === "bn" ? "বিক্রয়ের জন্য মজুদ/সম্পদ" : "Stock/Assets for sale"}
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="p-8 glass-card border-primary/30 ring-1 ring-primary/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Calculator className="h-24 w-24" />
        </div>
        
        <div className="relative z-10 text-center space-y-2">
          <p className="text-sm font-bold text-primary uppercase tracking-widest">{t.calculators.zakat_payable}</p>
          <h3 className="text-5xl font-black text-gradient">
            {totalZakat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            {t.calculators.zakat_formula}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-center text-muted-foreground px-4">
        {t.calculators.zakat_note}
      </p>
    </div>
  )
}

function InputField({ label, icon, value, onChange, placeholder }: { 
  label: string, 
  icon: React.ReactNode, 
  value: string, 
  onChange: (v: string) => void,
  placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-foreground/70 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input 
          type="number" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">BDT</span>
      </div>
    </div>
  )
}
