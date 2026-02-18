"use client"

import React, { useMemo } from "react"
import { Quote } from "lucide-react"
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
    <div className="relative overflow-hidden rounded-3xl p-6 glass-card-strong">
      {/* Decorative Quote Icon */}
      <div className="absolute -top-2 -left-2 opacity-5">
        <Quote className="h-24 w-24" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {dailyReminder.type === "Ayat" ? t.reminders.ayat_label : t.reminders.hadith_label}
          </span>
          <Quote className="h-4 w-4 text-primary/40" />
        </div>

        <p className="text-lg font-medium leading-relaxed text-foreground/90 italic">
          "{dailyReminder.text}"
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <p className="text-xs font-serif text-primary/80">
            — {dailyReminder.source}
          </p>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            <div className="h-1.5 w-4 rounded-full bg-primary" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
