"use client"

import React, { useState, useCallback } from "react"
import { RotateCcw, Fingerprint, ChevronUp, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export function TasbihCounter() {
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [target, setTarget] = useState(33)
  const [isAnimating, setIsAnimating] = useState(false)
  const { t } = useTranslation()

  const increment = useCallback(() => {
    setCount(prev => prev + 1)
    setTotalCount(prev => prev + 1)
    setIsAnimating(true)
    
    // Haptic feedback
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }

    // Reset animation
    setTimeout(() => setIsAnimating(false), 200)
  }, [])

  const resetCount = useCallback(() => {
    setCount(0)
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate([30, 30, 30])
    }
  }, [])

  const resetTotal = useCallback(() => {
    setTotalCount(0)
    setCount(0)
  }, [])

  return (
    <div className="flex flex-col gap-8 p-8 glass-card">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gradient">{t.nav.tasbih}</h3>
          <p className="text-xs text-muted-foreground">{t.common.loading.replace("...", "")} {t.nav.tasbih}</p>
        </div>
        <select 
          value={target} 
          onChange={(e) => setTarget(Number(e.target.value))}
          className="bg-secondary/50 border border-border/50 rounded-lg px-2 py-1 text-xs font-bold focus:outline-hidden ring-primary/20"
        >
          <option value={33}>Target: 33</option>
          <option value={99}>Target: 99</option>
          <option value={100}>Target: 100</option>
        </select>
      </div>

      {/* Main Counter Area */}
      <div 
        onClick={increment}
        className="relative aspect-square w-full max-w-[400px] mx-auto flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
      >
        {/* Animated Rings */}
        <div className={cn(
          "absolute inset-0 rounded-full border-4 border-primary/10 transition-all duration-300",
          isAnimating && "scale-105 border-primary/30"
        )} />
        <div className="absolute inset-4 rounded-full border border-primary/5 bg-secondary/10 shadow-inner" />
        
        {/* Progress Fill */}
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${(count / target) * 300}, 300`}
            className="text-primary transition-all duration-500 ease-out"
          />
        </svg>

        <div className="text-center z-10 space-y-2">
          <div 
            className={cn(
              "text-7xl font-black transition-all duration-200",
              isAnimating ? "scale-110 text-primary" : "text-foreground"
            )}
          >
            {count}
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">SubhanAllah</p>
        </div>

        {/* Floating Icon */}
        <div className="absolute bottom-8 text-primary/40 animate-pulse">
          <Fingerprint className="h-6 w-6" />
        </div>
      </div>

      {/* Stats and Controls */}
      <div className="flex items-center justify-around bg-secondary/30 rounded-2xl p-4 border border-border/50">
        <div className="text-center flex flex-col items-center gap-1">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Total</span>
          <span className="text-sm font-black">{totalCount}</span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        <button 
          onClick={(e) => {
            e.stopPropagation();
            resetCount();
          }}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center group-hover:bg-destructive group-hover:text-white transition-all">
            <RotateCcw className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Reset</span>
        </button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground">
        Haptic feedback will trigger on every tap.
      </p>
    </div>
  )
}
