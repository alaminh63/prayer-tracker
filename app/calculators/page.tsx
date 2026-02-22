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
        title={<span className="text-gradient">{t.calculators.title}</span>} 
        subtitle={t.calculators.subtitle} 
      />

      <div className="px-4 lg:px-8 pb-32 w-full mx-auto">
        {/* Modern Compact Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 p-2 bg-secondary border border-border rounded-[2.5rem] shadow-sm ring-1 ring-border/5 max-w-sm mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative group flex items-center gap-3 px-8 py-3.5 rounded-full transition-all duration-500 overflow-hidden",
                  isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCalculatorTab"
                    className={cn("absolute inset-0 bg-linear-to-r shadow-2xl", tab.color)}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={cn(
                  "relative z-10 transition-transform duration-500",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}>
                  {tab.icon}
                </div>
                <span className="relative z-10   font-black uppercase tracking-wider">{tab.label}</span>
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
