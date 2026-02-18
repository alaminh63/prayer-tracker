"use client"

import { useEffect, useState, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setCurrentAndNext } from "@/store/prayerSlice"
import {
  getCurrentAndNextPrayer,
  formatCountdown,
  PRAYER_LABELS,
  PRAYER_ARABIC,
} from "@/lib/prayer-utils"

export function CountdownRing() {
  const dispatch = useAppDispatch()
  const { timings, nextPrayer, timeLeft, loading } = useAppSelector(
    (state) => state.prayer
  )
  const [displayTime, setDisplayTime] = useState("--:--:--")
  const [progress, setProgress] = useState(0)

  const updatePrayerInfo = useCallback(() => {
    if (!timings) return
    const info = getCurrentAndNextPrayer(timings)
    dispatch(setCurrentAndNext(info))
  }, [timings, dispatch])

  useEffect(() => {
    updatePrayerInfo()
    const interval = setInterval(updatePrayerInfo, 1000)
    return () => clearInterval(interval)
  }, [updatePrayerInfo])

  useEffect(() => {
    if (loading || !timings) {
      setDisplayTime("--:--:--")
      setProgress(0)
      return
    }
    setDisplayTime(formatCountdown(timeLeft))
    // Calculate progress (assuming max wait ~6 hours = 21600000ms)
    const maxTime = 6 * 60 * 60 * 1000
    const p = Math.max(0, Math.min(1, 1 - timeLeft / maxTime))
    setProgress(p)
  }, [timeLeft, loading, timings])

  const size = 220
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const [h, m, s] = displayTime.split(":")

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.20 0.015 260)"
            strokeWidth={strokeWidth}
          />
        </svg>
        {/* Progress ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.80 0.13 85)" />
              <stop offset="100%" stopColor="oklch(0.72 0.12 175)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Next Prayer
          </p>
          {nextPrayer && (
            <>
              <p className="text-lg font-bold text-glow-gold">
                {PRAYER_LABELS[nextPrayer]}
              </p>
              <p className="text-xs text-muted-foreground font-serif mb-3">
                {PRAYER_ARABIC[nextPrayer]}
              </p>
            </>
          )}
          <div
            className="flex items-baseline gap-0.5 font-mono tabular-nums"
            aria-label={`Countdown: ${displayTime}`}
          >
            <span className="text-3xl font-bold text-foreground">{h}</span>
            <span className="text-xl text-primary animate-pulse mx-0.5">:</span>
            <span className="text-3xl font-bold text-foreground">{m}</span>
            <span className="text-xl text-primary animate-pulse mx-0.5">:</span>
            <span className="text-3xl font-bold text-foreground">{s}</span>
          </div>
        </div>
      </div>

      {/* Time unit labels below */}
      <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
    </div>
  )
}
