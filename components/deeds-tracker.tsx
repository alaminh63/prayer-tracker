"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Sun, Moon, Sunrise, CloudSun, Calendar as CalendarIcon, Loader2, ChevronRight, ChevronLeft, Award, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

const CATEGORIES = [
  { id: "salat", label: "সালাত", icon: Sunrise, color: "from-blue-500 to-indigo-600" },
  { id: "morning", label: "সকাল", icon: Sun, color: "from-orange-400 to-amber-500" },
  { id: "evening", label: "বিকাল", icon: CloudSun, color: "from-rose-400 to-pink-500" },
  { id: "night", label: "রাত", icon: Moon, color: "from-slate-700 to-zinc-900" },
]

const DEED_DEFINITIONS: Record<string, { id: string; label: string; desc: string }[]> = {
  salat: [
    { id: "fajr", label: "ফজর", desc: "ফজর নামাজ" },
    { id: "dhuhr", label: "যোহর", desc: "যোহর নামাজ" },
    { id: "asr", label: "আসর", desc: "আসর নামাজ" },
    { id: "maghrib", label: "মাগরিব", desc: "মাগরিব নামাজ" },
    { id: "isha", label: "এশা", desc: "এশা নামাজ" },
  ],
  morning: [
    { id: "morning_adhkar", label: "সকালের জিকির", desc: "মাসনুন দোয়া ও জিকির" },
    { id: "quran_reading", label: "কুরআন পাঠ", desc: "স্মরণ ও তিলাওয়াত" },
    { id: "duha", label: "ইশরাক/দুহা", desc: "চাশতের নামাজ" },
  ],
  evening: [
    { id: "evening_adhkar", label: "সন্ধ্যার জিকির", desc: "মাসনুন দোয়া ও জিকির" },
    { id: "surah_mulk", label: "সুরা মুলক", desc: "প্রতি রাতের আমল" },
    { id: "istighfar", label: "ইস্তাগফার", desc: "ক্ষমা প্রার্থনা" },
  ],
  night: [
    { id: "tahajjud", label: "তাহাজ্জুদ", desc: "শেষ রাতের ইবাদত" },
    { id: "witr", label: "বিতর", desc: "সালাতুল বিতর" },
    { id: "sleep_sunnah", label: "ঘুমানোর সুন্নাত", desc: "নবীজির (সা.) আমল" },
  ],
}

export function DeedsTracker() {
  const [activeTab, setActiveTab] = useState("salat")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [allData, setAllData] = useState<any>({ salat: {}, morning: {}, evening: {}, night: {} })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [date])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/prayers/track?date=${date}`)
      const data = await res.json()
      setAllData({
        salat: data.salat || {},
        morning: data.morning || {},
        evening: data.evening || {},
        night: data.night || {},
      })
    } catch (err) {
      console.error(err)
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const toggleDeed = async (category: string, id: string) => {
    const currentStatus = !!allData[category]?.[id]
    const newStatus = !currentStatus
    
    // Optimistic update
    setAllData((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], [id]: newStatus }
    }))
    setUpdating(id)

    try {
      const res = await fetch("/api/prayers/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, id, category, status: newStatus })
      })
      if (!res.ok) throw new Error("Update failed")
    } catch (err) {
      console.error(err)
      toast.error("আপডেট করা সম্ভব হয়নি")
      // Rollback
      setAllData((prev: any) => ({
        ...prev,
        [category]: { ...prev[category], [id]: currentStatus }
      }))
    } finally {
      setUpdating(null)
    }
  }

  const getProgress = (catId: string) => {
    const deeds = DEED_DEFINITIONS[catId]
    if (!deeds) return 0
    const completed = deeds.filter(d => !!allData[catId]?.[d.id]).length
    return Math.round((completed / deeds.length) * 100)
  }

  const navigateDate = (days: number) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    setDate(newDate.toISOString().split("T")[0])
  }

  return (
    <div className="flex flex-col gap-8  mx-auto pb-20">
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/5">
            <Trophy size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">দৈনিক আমল ট্র্যাকার</h2>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">আপনার ইবাদতের গ্রাফ উন্নত করুন</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => navigateDate(-1)}>
            <ChevronLeft size={20} />
          </Button>
          <div className="flex items-center gap-2 px-4 border-x border-white/5">
            <CalendarIcon size={16} className="text-primary" />
            <span className="text-sm font-black text-white">{date === new Date().toISOString().split("T")[0] ? "আজ" : date}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => navigateDate(1)}>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const progress = getProgress(cat.id)
          const isActive = activeTab === cat.id
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "relative group flex flex-col p-6 rounded-4xl border transition-all overflow-hidden",
                isActive 
                  ? "bg-zinc-900 border-primary/40 shadow-2xl scale-[1.02]" 
                  : "bg-zinc-950/40 border-white/5 hover:border-white/10"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-10 bg-linear-to-br",
                cat.color
              )} />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                  isActive ? "bg-primary text-white scale-110 shadow-lg" : "bg-white/5 text-zinc-400 group-hover:text-primary"
                )}>
                  <cat.icon size={20} />
                </div>
                
                <div className="text-left">
                  <h3 className={cn(
                    "font-black text-lg",
                    isActive ? "text-white" : "text-zinc-400"
                  )}>{cat.label}</h3>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter mt-1">
                    <span className={isActive ? "text-primary" : "text-zinc-600"}>{progress}%</span>
                    <span className="text-zinc-600">সম্পন্ন</span>
                  </div>
                </div>
                
                <Progress value={progress} className="h-1.5 bg-white/5" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Deeds List */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + date}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="text-primary animate-spin" />
                <p className="text-zinc-500 font-bold">লোড হচ্ছে...</p>
              </div>
            ) : (
              DEED_DEFINITIONS[activeTab].map((deed) => {
                const isCompleted = !!allData[activeTab]?.[deed.id]
                const isUpdating = updating === deed.id

                return (
                  <button
                    key={deed.id}
                    onClick={() => toggleDeed(activeTab, deed.id)}
                    disabled={loading || isUpdating}
                    className={cn(
                      "group flex items-center justify-between p-6 rounded-4xl border transition-all text-left",
                      isCompleted 
                        ? "bg-primary/20 border-primary/30 shadow-xl" 
                        : "bg-zinc-950/40 border-white/5 hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all border",
                        isCompleted 
                          ? "bg-primary text-white border-primary shadow-lg scale-110" 
                          : "bg-white/5 text-zinc-500 border-white/5 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                      )}>
                        {isUpdating ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : isCompleted ? (
                          <CheckCircle2 size={28} />
                        ) : (
                          <Circle size={28} />
                        )}
                      </div>
                      
                      <div>
                        <h4 className={cn(
                          "text-xl font-black transition-colors font-inter",
                          isCompleted ? "text-white" : "text-zinc-300 group-hover:text-primary"
                        )}>{deed.label}</h4>
                        <p className="text-xs text-zinc-500 font-medium">{deed.desc}</p>
                      </div>
                    </div>

                    <div className={cn(
                      "h-10 px-6 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all",
                      isCompleted 
                        ? "bg-primary text-white" 
                        : "bg-white/5 text-zinc-500 group-hover:bg-primary/20 group-hover:text-primary"
                    )}>
                      {isCompleted ? "সম্পন্ন" : "মার্ক করুন"}
                    </div>
                  </button>
                )
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Motivation Card */}
      <div className="bg-linear-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
        <div className="h-20 w-20 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
          <Award size={40} />
        </div>
        <div className="text-center md:text-left flex-1">
          <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Daily Motivation</p>
          <h3 className="text-xl font-bold text-white mb-2 italic">"নামাজ মুমিনদের জন্য একটি নির্ধারিত সময়ের ইবাদত।"</h3>
          <p className="text-sm text-zinc-500">প্রতিদিনের আমলগুলো আপনার আত্মিক শক্তি বৃদ্ধি করে। নিরবচ্ছিন্ন থাকার চেষ্টা করুন।</p>
        </div>
      </div>
    </div>
  )
}
