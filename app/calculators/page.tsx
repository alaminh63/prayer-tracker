"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { Calculator, Coins, ArrowRight } from "lucide-react"
import { ZakatCalculator } from "@/components/zakat-calculator"
import { FitraCalculator } from "@/components/fitra-calculator"

type TabType = "zakat" | "fitra"

export default function CalculatorsHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>("zakat")
  const { t } = useTranslation()

  const tabs: { id: TabType; label: string; icon: React.ReactNode; color: string; description: string }[] = [
    { 
      id: "zakat", 
      label: t.nav.zakat, 
      icon: <Calculator size={24} />, 
      color: "from-orange-500/20 to-amber-500/20",
      description: t.calculators.zakat_guide
    },
    { 
      id: "fitra", 
      label: t.nav.fitra, 
      icon: <Coins size={24} />, 
      color: "from-emerald-500/20 to-teal-500/20",
      description: t.calculators.fitra_guide
    },
  ]

  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">হিসাব-নিকাশ</span>} 
        subtitle="সঠিকভাবে আপনার জাকাত এবং ফিতরা হিসাব করুন" 
      />

      <div className="px-4 lg:px-8 pb-32 w-full max-w-7xl mx-auto">
        {/* Modern Tab Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative group p-8 rounded-[2.5rem] border-2 transition-all duration-700 overflow-hidden text-left",
                  isActive 
                    ? "bg-zinc-900 border-primary shadow-2xl" 
                    : "bg-zinc-950/40 border-white/5 hover:border-white/10"
                )}
              >
                {/* Background Decor */}
                <div className={cn(
                  "absolute top-0 right-0 h-48 w-48 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 transition-all duration-700",
                  isActive ? "bg-primary opacity-40 scale-150" : "bg-white/5"
                )} />

                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-6 w-full">
                    <div className={cn(
                      "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-2xl",
                      isActive ? "bg-primary text-white scale-110" : "bg-zinc-900 text-zinc-500"
                    )}>
                      {tab.icon}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className={cn(
                        "text-3xl font-black tracking-tight transition-colors duration-500",
                        isActive ? "text-white" : "text-zinc-500"
                      )}>{tab.label}</h3>
                      <p className={cn(
                        "text-sm font-bold transition-colors duration-500",
                        isActive ? "text-white/60" : "text-zinc-700"
                      )}>{tab.description}</p>
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-500",
                      isActive ? "text-primary opacity-100 translate-x-2" : "text-zinc-800 opacity-0 -translate-x-4"
                    )}>
                      {t.common.done} <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeTab === "zakat" && <ZakatCalculator />}
              {activeTab === "fitra" && <FitraCalculator />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}
