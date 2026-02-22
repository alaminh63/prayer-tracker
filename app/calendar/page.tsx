"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { HijriCalendar } from "@/components/hijri-calendar"
import { RamadanCalendar } from "@/components/ramadan-calendar"
import { cn } from "@/lib/utils"
import { CalendarDays, Moon, LayoutGrid } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

export default function CalendarPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<"calendar" | "ramadan">("calendar")

  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">{t.calendar.title}</span>} 
        subtitle={t.calendar.subtitle} 
      />

      <div className="px-4 lg:px-8 pb-32 w-full">
        {/* Tab Switcher */}
        <div className="flex justify-center gap-4 mb-10 p-1.5 bg-secondary border border-border rounded-2xl backdrop-blur-xl w-fit mx-auto shadow-sm ring-1 ring-border">
          <button
            onClick={() => setActiveTab("calendar")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-sm font-black",
              activeTab === "calendar" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CalendarDays size={16} />
            {t.calendar.hijri_calendar}
          </button>
          <button
            onClick={() => setActiveTab("ramadan")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-sm font-black",
              activeTab === "ramadan" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Moon size={16} />
            {t.calendar.ramadan_special}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "calendar" ? (
              <HijriCalendar />
            ) : (
              <RamadanCalendar />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  )
}
