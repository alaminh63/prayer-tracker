"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, Share2, Quote, Sparkles } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchDailyHadith } from "@/store/hadithSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export function HadithCard() {
  const dispatch = useAppDispatch()
  const { dailyHadith, loading } = useAppSelector((state) => state.hadith)
  const { t, language } = useTranslation()

  useEffect(() => {
    dispatch(fetchDailyHadith({ language }))
  }, [dispatch, language])

  const handleShare = () => {
    if (dailyHadith.hadith) {
      const text = `Hadith: ${dailyHadith.hadith.text}\nSource: ${dailyHadith.book}\nShared via Salat Time App`
      if (navigator.share) {
        navigator.share({
          title: t.reminders.hadith_label,
          text: text,
          url: window.location.origin
        }).catch(() => {})
      } else {
        navigator.clipboard.writeText(text)
        toast.success("Hadith copied to clipboard")
      }
    }
  }

  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("salat_hadith_daily")
    }
    dispatch(fetchDailyHadith({ language, force: true }))
  }

  if (loading && !dailyHadith.hadith) {
    return (
      <div className="rounded-[2.5rem] border border-border bg-card p-8 backdrop-blur-xl animate-pulse min-h-[300px] flex flex-col justify-center gap-6">
        <Skeleton className="h-10 w-40 rounded-full bg-muted" />
        <Skeleton className="h-24 w-full rounded-2xl bg-muted" />
        <Skeleton className="h-10 w-full rounded-2xl bg-muted" />
      </div>
    )
  }

  if (!dailyHadith.hadith) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[2.5rem] p-8 bg-card border border-border backdrop-blur-3xl shadow-2xl flex flex-col justify-center min-h-[300px]"
    >
      {/* Decorative Quote Icon */}
      <div className="absolute -top-10 -right-10 opacity-[0.02] text-primary transition-transform group-hover:scale-110 duration-700 pointer-events-none">
        <Quote className="h-64 w-64 rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Sparkles size={20} className="fill-primary" />
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-black uppercase tracking-normal text-primary">
                 {t.reminders.hadith_title}
               </span>
               <span className="text-[10px] font-bold text-zinc-500 uppercase">
                 {dailyHadith.book} — #{dailyHadith.hadith?.hadithnumber}
               </span>
             </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="p-2.5 rounded-full bg-secondary border border-border hover:bg-primary/20 hover:border-primary/20 transition-all text-muted-foreground hover:text-primary group/btn"
              title="New Hadith"
            >
              <RefreshCw className={cn("h-4.5 w-4.5 transition-all duration-500", loading ? "animate-spin" : "group-hover/btn:rotate-180")} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2.5 rounded-full bg-secondary border border-border hover:bg-primary/20 hover:border-primary/20 transition-all text-muted-foreground hover:text-primary"
              title="Share Wisdom"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dailyHadith.hadith.hadithnumber}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            <p className="text-xl md:text-2xl font-bold leading-relaxed text-foreground dark:text-white tracking-tight italic decoration-primary/20">
              "{dailyHadith.hadith.text}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-white/5">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-normal">Authentication</span>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-black text-emerald-500 uppercase tracking-tight">
                    {dailyHadith.hadith?.grades?.[0]?.grade || "Authentic Sahih"}
                   </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                <p className="text-[10px] font-black text-muted-foreground dark:text-zinc-500 uppercase tracking-normal">
                  {t.reminders.hadith_source}{dailyHadith.book}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
