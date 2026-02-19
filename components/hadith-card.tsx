"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, RefreshCw, Share2, Quote } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchDailyHadith } from "@/store/hadithSlice"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export function HadithCard() {
  const dispatch = useAppDispatch()
  const { dailyHadith, loading } = useAppSelector((state) => state.hadith)

  useEffect(() => {
    dispatch(fetchDailyHadith())
  }, [dispatch])

  const handleShare = () => {
    if (dailyHadith.hadith) {
      const text = `Hadith: ${dailyHadith.hadith.text}\nSource: ${dailyHadith.book}\nShared via Salat Time App`
      if (navigator.share) {
        navigator.share({
          title: "Hadith of the Day",
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
    // Clear lastUpdated to force fetch
    if (typeof window !== "undefined") {
      localStorage.removeItem("salat_hadith_daily")
    }
    dispatch(fetchDailyHadith())
  }

  if (loading && !dailyHadith.hadith) {
    return (
      <div className="rounded-3xl border border-white/5 bg-zinc-950/40 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-20 w-full mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!dailyHadith.hadith) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950/40 p-8 backdrop-blur-3xl transition-all hover:border-primary/20 shadow-2xl ring-1 ring-white/5"
    >
      {/* Background Decor */}
      <div className="absolute -right-8 -top-8 text-primary/5 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">
        <Quote size={180} />
      </div>

      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary ring-1 ring-primary/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Daily Wisdom</span>
              <h4 className="text-sm font-black text-zinc-400 tracking-tight">{dailyHadith.book}</h4>
            </div>
          </div>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none bg-zinc-900/50 px-2 py-1 rounded-md border border-white/5">
            #{dailyHadith.hadith?.hadithnumber}
          </span>
        </div>

        <div className="flex-1 mb-8">
          <p className="text-xl leading-relaxed text-zinc-100 font-bold italic font-inter decoration-primary/20">
            "{dailyHadith.hadith?.text}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-white/5 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">Authentication</span>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-black text-emerald-500 uppercase tracking-tight">
                {dailyHadith.hadith?.grades?.[0]?.grade || "Authentic Sahih"}
               </span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-11 w-11 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 backdrop-blur-xl"
              onClick={handleRefresh}
              title="New Hadith"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-11 w-11 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 backdrop-blur-xl"
              onClick={handleShare}
              title="Share Wisdom"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
