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
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950/40 p-8 backdrop-blur-xl transition-all hover:border-primary/20 shadow-2xl"
    >
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 text-primary/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
        <Quote size={140} />
      </div>

      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Daily Wisdom</span>
              <h4 className="text-xs font-bold text-zinc-500">{dailyHadith.book}</h4>
            </div>
          </div>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">
            #{dailyHadith.hadith?.hadithnumber}
          </span>
        </div>

        <div className="flex-1 mb-8">
          <p className="text-lg leading-relaxed text-zinc-100 font-medium italic font-inter decoration-primary/20">
            "{dailyHadith.hadith?.text}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Authentication</span>
            <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">
              {dailyHadith.hadith?.grades?.[0]?.grade || "Authentic Sahih"}
            </span>
          </div>

          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={handleRefresh}
              title="New Hadith"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
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
