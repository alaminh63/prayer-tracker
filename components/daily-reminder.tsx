"use client"

import React, { useMemo } from "react"
import { Quote, Star } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface Reminder {
  text: string
  source: string
  type: "Ayat" | "Hadith"
}

const REMINDERS: Reminder[] = [
  {
    text: "Indeed, with hardship [will be] ease.",
    source: "Quran 94:6",
    type: "Ayat",
  },
  {
    text: "The best among you are those who have the best manners and character.",
    source: "Sahih Bukhari",
    type: "Hadith",
  },
  {
    text: "So remember Me; I will remember you.",
    source: "Quran 2:152",
    type: "Ayat",
  },
  {
    text: "A good word is charity.",
    source: "Sahih Bukhari",
    type: "Hadith",
  },
  {
    text: "My mercy encompasses all things.",
    source: "Quran 7:156",
    type: "Ayat",
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    source: "Quran 2:286",
    type: "Ayat",
  },
  {
    text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.",
    source: "Sahih Bukhari",
    type: "Hadith",
  }
]

export function DailyReminder() {
  const { t, language } = useTranslation()
  const dailyReminder = useMemo(() => {
    const today = new Date().toDateString()
    const index = Math.abs(today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % REMINDERS.length
    return REMINDERS[index]
  }, [])

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] p-10 bg-zinc-950/40 border border-white/5 backdrop-blur-3xl shadow-2xl group ring-1 ring-white/5">
      {/* Decorative Quote Icon */}
      <div className="absolute -top-4 -left-4 opacity-[0.03] text-primary transition-transform group-hover:scale-110 duration-700">
        <Quote className="h-40 w-40" />
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Star size={14} className="fill-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
               {dailyReminder.type === "Ayat" ? t.reminders.ayat_label : t.reminders.hadith_label}
             </span>
          </div>
          <Quote className="h-5 w-5 text-primary/30" />
        </div>

        <p className="text-2xl md:text-3xl font-black leading-tight text-white italic tracking-tight underline decoration-primary/20 underline-offset-8">
          "{dailyReminder.text}"
        </p>

        <div className="flex items-center justify-between pt-8 border-t border-white/5 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-xs font-black text-primary uppercase tracking-widest">
              {dailyReminder.source}
            </p>
          </div>
          <div className="flex gap-1.5 focus-within:ring-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
            <div className="h-1.5 w-6 rounded-full bg-primary" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  )
}
