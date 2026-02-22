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
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetchData()
    fetchStreak()
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
      toast.error("정보 로드에 실패했습니다")
    } finally {
      setLoading(false)
    }
  }

  const fetchStreak = async () => {
    try {
      const res = await fetch("/api/deeds/history?days=60")
      const history = await res.json()
      
      let currentStreak = 0
      const today = new Date().toISOString().split("T")[0]
      const sortedHistory = history.sort((a: any, b: any) => b.date.localeCompare(a.date))
      
      // Basic streak logic: count consecutive days with at least 50% progress
      for (const record of sortedHistory) {
        if (record.date > today) continue;
        
        const salatCount = Object.values(record.salat || {}).filter(v => v).length
        const totalCount = salatCount + 
          Object.values(record.morning || {}).filter(v => v).length + 
          Object.values(record.evening || {}).filter(v => v).length + 
          Object.values(record.night || {}).filter(v => v).length
        
        if (totalCount >= 7) { // 50% of 14
          currentStreak++
        } else if (record.date !== today) {
          break
        }
      }
      setStreak(currentStreak)
    } catch (err) {
      console.error("Failed to fetch streak:", err)
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
      // Re-fetch streak if daily goal might be met
      fetchStreak()
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
    <div className="flex flex-col gap-8 mx-auto pb-20 w-full">
      {/* Header & Date Picker */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-border backdrop-blur-xl group ring-1 ring-border shadow-sm">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10 group-hover:scale-110 transition-transform duration-500">
            <Trophy size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground dark:text-white">দৈনিক আমল ট্র্যাকার</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] bg-primary/10 px-2 py-0.5 rounded shadow-sm">
                Streak: {streak} Days
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-secondary p-2.5 rounded-2xl border border-border shadow-inner ring-1 ring-border">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted transition-colors" onClick={() => navigateDate(-1)}>
            <ChevronLeft size={20} />
          </Button>
          <div className="flex items-center gap-3 px-6 border-x border-border">
            <CalendarIcon size={18} className="text-primary" />
            <span className="text-sm font-black text-foreground dark:text-white tracking-tight">
              {date === new Date().toISOString().split("T")[0] ? "আজকের আমলনামা" : date}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted transition-colors" onClick={() => navigateDate(1)}>
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
                  ? "bg-secondary border-primary/40 shadow-2xl scale-[1.02]" 
                  : "bg-card border-border hover:border-primary/20 shadow-sm"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-10 bg-linear-to-br",
                cat.color
              )} />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                  isActive ? "bg-primary text-white scale-110 shadow-lg" : "bg-muted text-muted-foreground group-hover:text-primary"
                )}>
                  <cat.icon size={20} />
                </div>
                
                <div className="text-left">
                  <h3 className={cn(
                    "font-black text-lg",
                    isActive ? "text-foreground dark:text-white" : "text-muted-foreground"
                  )}>{cat.label}</h3>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter mt-1">
                    <span className={isActive ? "text-primary" : "text-muted-foreground"}>{progress}%</span>
                    <span className="text-muted-foreground">সম্পন্ন</span>
                  </div>
                </div>
                
                <Progress value={progress} className="h-1.5 bg-muted" />
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
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-muted/20 rounded-[2.5rem] border border-border">
                <Loader2 size={40} className="text-primary animate-spin" />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">লোড হচ্ছে...</p>
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
                      "group flex items-center justify-between p-1 rounded-4xl border transition-all duration-500 text-left outline-hidden shadow-xs",
                      isCompleted 
                        ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/5" 
                        : "bg-card border-border hover:border-primary/20 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-5 p-4">
                      <div className={cn(
                        "h-14 w-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border",
                        isCompleted 
                          ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105" 
                          : "bg-muted text-muted-foreground border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                      )}>
                        {isUpdating ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : isCompleted ? (
                          <CheckCircle2 size={30} strokeWidth={2.5} />
                        ) : (
                          <Circle size={30} strokeWidth={2} className="opacity-40" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className={cn(
                          "text-xl font-black transition-colors",
                          isCompleted ? "text-foreground dark:text-white" : "text-muted-foreground group-hover:text-primary"
                        )}>{deed.label}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{deed.desc}</p>
                      </div>
                    </div>

                    <div className={cn(
                      "mr-6 h-10 px-8 rounded-2xl flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-sm",
                      isCompleted 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
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
          <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 italic">"নামাজ মুমিনদের জন্য একটি নির্ধারিত সময়ের ইবাদত।"</h3>
          <p className="text-sm text-muted-foreground">প্রতিদিনের আমলগুলো আপনার আত্মিক শক্তি বৃদ্ধি করে। নিরবচ্ছিন্ন থাকার চেষ্টা করুন।</p>
        </div>
      </div>
    </div>
  )
}
