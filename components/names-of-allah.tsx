"use client"

import React from "react"
import { ALLAH_NAMES } from "@/lib/allah-names"

export function NamesOfAllah() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {ALLAH_NAMES.map((item) => (
        <div 
          key={item.id}
          className="p-6 glass-card flex flex-col items-center text-center gap-3 group hover:border-primary/40"
        >
          <div className="text-3xl font-black text-primary group-hover:scale-110 transition-transform duration-300 font-serif">
            {item.arabic}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold tracking-tight">{item.transliteration}</p>
            <p className="text-[11px] text-muted-foreground leading-tight">{item.meaningBn}</p>
          </div>
          <div className="h-1 w-8 rounded-full bg-primary/10 group-hover:bg-primary/30 transition-colors" />
        </div>
      ))}
    </div>
  )
}
