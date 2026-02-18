"use client"

import React, { useState, useEffect } from "react"
import { Heart, Info, Calculator, Banknote } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export function FitraCalculator() {
  const [familyMembers, setFamilyMembers] = useState<string>("1")
  const [fitraRate, setFitraRate] = useState<string>("115") // Base rate in BDT
  const [totalFitra, setTotalFitra] = useState<number>(0)
  const { t, language } = useTranslation()

  useEffect(() => {
    const total = parseFloat(familyMembers || "0") * parseFloat(fitraRate || "0")
    setTotalFitra(total)
  }, [familyMembers, fitraRate])

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 glass-card bg-linear-to-br from-primary/10 to-transparent">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.calculators.fitra_title}</h2>
            <p className="text-xs text-muted-foreground">{t.calculators.fitra_guide}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/70 flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t.calculators.fitra_family}
            </label>
            <input 
              type="number" 
              value={familyMembers}
              onChange={(e) => setFamilyMembers(e.target.value)}
              className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all font-bold"
              placeholder={language === "bn" ? "সদস্য সংখ্যা" : "Number of members"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/70 flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              {t.calculators.fitra_amount}
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={fitraRate}
                onChange={(e) => setFitraRate(e.target.value)}
                className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">BDT</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 px-1">
              {language === "bn" ? "২০২৪ সালের জন্য গমের ভিত্তিতে ন্যূনতম হার ১১৫ টাকা।" : "Current minimum rate for 2024 is approx. 115 BDT based on wheat."}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 glass-card border-primary/30 ring-1 ring-primary/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Calculator className="h-24 w-24" />
        </div>
        
        <div className="relative z-10 text-center space-y-2">
          <p className="text-sm font-bold text-primary uppercase tracking-widest">{t.calculators.fitra_total}</p>
          <h3 className="text-5xl font-black text-gradient">
            {totalFitra.toLocaleString()}
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            {language === "bn" ? "অনুগ্রহ করে ইসলামিক ফাউন্ডেশন থেকে বর্তমান বছরের হার যাচাই করে নিন।" : "Please verify the current year's rates from Islamic Foundation."}
          </p>
        </div>
      </div>
    </div>
  )
}
