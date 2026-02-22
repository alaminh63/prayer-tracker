"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Quote, Sparkles, RefreshCw, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AyahData {
  arabic: string
  bengali: string
  english: string
  surah: string
  number: number
  surahNumber: number
}

export function DailyReminder() {
  const [ayah, setAyah] = useState<AyahData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchAyah = useCallback(async () => {
    setLoading(true)
    try {
      const randomId = Math.floor(Math.random() * 6236) + 1
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${randomId}/editions/quran-uthmani,bn.bengali,en.sahih`)
      const result = await response.json()
      
      if (result.status === "OK" && result.data.length === 3) {
        setAyah({
          arabic: result.data[0].text,
          bengali: result.data[1].text,
          english: result.data[2].text,
          surah: result.data[0].surah.englishName,
          number: result.data[0].numberInSurah,
          surahNumber: result.data[0].surah.number
        })
      }
    } catch (error) {
      console.error("Failed to fetch Ayah:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAyah()
  }, [fetchAyah])

  const handleShare = () => {
    if (ayah) {
      const text = `Ayah: ${ayah.arabic}\nBengali: ${ayah.bengali}\nSurah: ${ayah.surah} (${ayah.surahNumber}:${ayah.number})\nShared via Salat Time App`
      if (navigator.share) {
        navigator.share({
          title: "Ayah of the Moment",
          text: text,
          url: window.location.origin
        }).catch(() => {})
      } else {
        navigator.clipboard.writeText(text)
        toast.success("Ayah copied to clipboard")
      }
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 bg-card border border-border backdrop-blur-3xl shadow-2xl group min-h-[300px] flex flex-col justify-center">
      {/* Decorative Quote Icon */}
      <div className="absolute -top-6 -left-6 opacity-[0.02] text-primary transition-transform group-hover:scale-110 duration-700 pointer-events-none">
        <Quote className="h-48 w-48" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Sparkles size={18} className="fill-primary" />
             </div>
             <span className="text-xs font-black uppercase tracking-normal text-primary">
               কুরআনের আলো
             </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => fetchAyah()}
              disabled={loading}
              className="p-2.5 rounded-full bg-secondary border border-border hover:bg-primary/20 hover:border-primary/20 transition-all text-muted-foreground hover:text-primary group/btn"
              title="নতুন আয়াত দেখুন"
            >
              <RefreshCw className={cn("h-4 w-4 transition-all duration-500", loading ? "animate-spin" : "group-hover/btn:rotate-180")} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2.5 rounded-full bg-secondary border border-border hover:bg-primary/20 hover:border-primary/20 transition-all text-muted-foreground hover:text-primary"
              title="আয়াত শেয়ার করুন"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {ayah && !loading ? (
            <motion.div
              key={`${ayah.surahNumber}:${ayah.number}`}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <p className="text-3xl md:text-4xl font-bold leading-relaxed text-foreground text-right font-arabic" dir="rtl">
                {ayah.arabic}
              </p>

              <div className="flex flex-col gap-3">
                <p className="text-xl md:text-2xl font-bold leading-tight text-foreground tracking-tight">
                  "{ayah.bengali}"
                </p>
                <p className="text-sm font-medium text-muted-foreground italic leading-relaxed">
                  "{ayah.english}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-6 border-t border-border">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-black text-primary uppercase tracking-normal">
                  {ayah.surah} — {ayah.surahNumber}:{ayah.number}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <RefreshCw className="h-8 w-8 text-primary/20 animate-spin" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-normal animate-pulse">
                আয়াত ফেচ করা হচ্ছে...
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
