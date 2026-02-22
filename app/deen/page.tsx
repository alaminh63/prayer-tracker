"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { AzkarViewer } from "@/components/azkar-viewer"
import { DuaList } from "@/components/dua-list"
import { NamesOfAllah } from "@/components/names-of-allah"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { BookOpen, Sparkles, Heart } from "lucide-react"

type TabType = "azkar" | "duas" | "names"

export default function DeenPage() {
  const [activeTab, setActiveTab] = useState<TabType>("azkar")
  const { t } = useTranslation()

  const tabs: { id: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      id: "azkar", 
      label: t.nav.azkar, 
      icon: <Sparkles size={18} />, 
      color: "from-amber-500/20 to-orange-500/20" 
    },
    { 
      id: "duas", 
      label: t.nav.duas, 
      icon: <BookOpen size={18} />, 
      color: "from-emerald-500/20 to-teal-500/20" 
    },
    { 
      id: "names", 
      label: t.nav.names, 
      icon: <Heart size={18} />, 
      color: "from-primary/20 to-rose-500/20" 
    },
  ]

  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">{t.deen.title}</span>} 
        subtitle={t.deen.subtitle} 
      />

      <div className="px-4 lg:px-8 pb-32 w-full">
        {/* Modern Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 p-2 bg-secondary border border-border rounded-[2.5rem] shadow-sm ring-1 ring-border/5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative group flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 overflow-hidden",
                  isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDeenTab"
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
                <span className="relative z-10 text-xs font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              {activeTab === "azkar" && <div className="space-y-8"><AzkarViewer /></div>}
              {activeTab === "duas" && <div className="space-y-8"><DuaList /></div>}
              {activeTab === "names" && <div className="space-y-8"><NamesOfAllah /></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}
