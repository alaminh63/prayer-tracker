"use client"

import React from "react"
import { DUA_DATA } from "@/lib/dua-data"
import { Bookmark, Share2 } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export function DuaList() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {DUA_DATA.map((dua) => (
        <div key={dua.id} className="p-6 glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-primary">{dua.titleBn}</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-secondary/20 p-6 rounded-2xl flex flex-col items-end gap-3 text-right">
            <p className="text-2xl font-serif leading-loose text-foreground">
              {dua.arabic}
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t.dua.meaning}</p>
              <p className="text-sm font-medium leading-relaxed">{dua.translationBn}</p>
            </div>
            <div className="p-2 bg-primary/5 rounded-lg inline-block">
              <p className="text-[10px] font-bold text-primary/70">{dua.reference}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
