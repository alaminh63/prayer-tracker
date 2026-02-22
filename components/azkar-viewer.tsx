"use client"

import React, { useState } from "react"
import { MORNING_AZKAR, EVENING_AZKAR, AzkarItem } from "@/lib/azkar-data"
import { Sun, Moon, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export function AzkarViewer() {
  const [tab, setTab] = useState<"morning" | "evening">("morning")
  const data = tab === "morning" ? MORNING_AZKAR : EVENING_AZKAR
  const { t, language } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex p-1 bg-secondary/50 rounded-2xl border border-border/50">
        <button
          onClick={() => setTab("morning")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm",
            tab === "morning" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <Sun className="h-4 w-4" />
          {t.azkar.morning} {t.azkar.morning_bn}
        </button>
        <button
          onClick={() => setTab("evening")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm",
            tab === "evening" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <Moon className="h-4 w-4" />
          {t.azkar.evening} {t.azkar.evening_bn}
        </button>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <AzkarCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function AzkarCard({ item }: { item: AzkarItem }) {
  const [count, setCount] = useState(0)
  const { t } = useTranslation()

  return (
    <div className="p-6 glass-card space-y-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
          {item.repetition}x
        </div>
        {count >= item.repetition && (
          <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in" />
        )}
      </div>

      <div className="bg-secondary/50 p-6 rounded-2xl flex flex-col items-end gap-3 text-right">
        <p className="text-2xl font-serif leading-loose text-foreground">
          {item.arabic}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium leading-relaxed">{item.translationBn}</p>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-muted-foreground bg-primary/5 px-2 py-1 rounded-md">{item.reference}</p>
          <button 
            onClick={() => setCount(prev => Math.min(prev + 1, item.repetition))}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all",
              count >= item.repetition 
                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 active:scale-95"
            )}
          >
            {count >= item.repetition ? t.azkar.completed : `${t.azkar.count}: ${count}/${item.repetition}`}
          </button>
        </div>
      </div>
    </div>
  )
}
