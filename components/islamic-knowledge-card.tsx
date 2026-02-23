"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const KNOWLEDGE_ITEMS = [
  {
    title: "আপনি কি জানেন?",
    text: "সেজদাহ হলো বান্দার জন্য আল্লাহর সবচেয়ে নিকটতম হওয়ার সময়। সিজদায় বেশি বেশি দুআ করুন।",
  },
  {
    title: "উত্তম আমল",
    text: "রাসূলুল্লাহ (সা.) বলেছেন: মানুষের মধ্যে সেই ব্যক্তিই সর্বোত্তম, যে অন্যের জন্য সবচেয়ে বেশি উপকারী।",
  },
  {
    title: "জান্নাতের চাবিকাঠি",
    text: "নামাজ হলো জান্নাতের চাবিকাঠি। নামাজের মাধ্যমেই আল্লাহর সন্তুষ্টি অর্জন সম্ভব।",
  },
  {
    title: "ধৈর্যের প্রতিদান",
    text: "নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন। বিপদে ভেঙে না পড়ে আল্লাহর ওপর ভরসা রাখুন।",
  },
  {
    title: "ক্ষমার বরকত",
    text: "বেশি বেশি ইস্তিগফার করুন। এটি রিজিক বৃদ্ধি করে এবং দুশ্চিন্তা দূর করে।",
  },
  {
    title: "নবীজির মহত্ত্ব",
    text: "রাসূলুল্লাহ (সা.) বলেছেন: যে আমার ওপর একবার দরুদ পাঠ করবে, আল্লাহ তার ওপর ১০ বার রহমত বর্ষণ করবেন।",
  },
  {
    title: "কুরআনের নূর",
    text: "কুরআন হলো অন্তরের প্রশান্তি। প্রতিদিন অন্তত এক পৃষ্ঠা হলেও কুরআন তিলাওয়াত করার অভ্যাস করুন।",
  },
]

export function IslamicKnowledgeCard() {
  const [index, setIndex] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Initialize with a random index, but only on the client
  useEffect(() => {
    setIndex(Math.floor(Math.random() * KNOWLEDGE_ITEMS.length))
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      let nextIndex = index
      while (nextIndex === index) {
        nextIndex = Math.floor(Math.random() * KNOWLEDGE_ITEMS.length)
      }
      setIndex(nextIndex)
      setIsRefreshing(false)
    }, 400)
  }

  const item = KNOWLEDGE_ITEMS[index]

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border group h-full min-h-[220px] flex flex-col justify-between">
      <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
      
      <div className="relative z-10 p-8 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Star className="h-5 w-5 fill-primary" />
            </div>
            <button 
              onClick={handleRefresh}
              className={cn(
                "p-2.5 rounded-xl bg-secondary border border-border text-primary hover:bg-primary/20 transition-all active:scale-95",
                isRefreshing && "animate-spin"
              )}
              title="নতুন তথ্য"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <h4 className="text-xl font-black text-foreground dark:text-white tracking-tight">{item.title}</h4>
              <p className="text-base text-muted-foreground dark:text-zinc-300 leading-relaxed font-bold">
                {item.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pt-4">
          <div className="h-1 w-12 bg-primary/40 rounded-full" />
        </div>
      </div>
    </div>
  )
}
