"use client"

import { useEffect, useState, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setCurrentAndNext } from "@/store/prayerSlice"
import { useTranslation } from "@/hooks/use-translation"
import {
  getCurrentAndNextPrayer,
  formatCountdown,
} from "@/lib/prayer-utils"

export function CountdownTimer() {
  const dispatch = useAppDispatch()
  const { timings, nextPrayer, timeLeft } = useAppSelector(
    (state) => state.prayer
  )
  const [displayTime, setDisplayTime] = useState("--:--:--")
  const { t } = useTranslation()

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
    setDisplayTime(formatCountdown(timeLeft))
  }, [timeLeft])

  const digits = displayTime.split("")

  const getPrayerKey = (name: string): keyof typeof t.prayers => {
    const map: Record<string, keyof typeof t.prayers> = {
      "Fajr": "fajr",
      "Sunrise": "sunrise",
      "Dhuhr": "dhuhr",
      "Asr": "asr",
      "Maghrib": "maghrib",
      "Isha": "isha",
      "Imsak": "imsak",
      "Midnight": "midnight"
    }
    return map[name] || "fajr"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
        {t.common.time_remaining}{" "}
        <span className="text-primary">
          {nextPrayer ? t.prayers[getPrayerKey(nextPrayer)] : "..."}
        </span>
      </p>
      <div className="flex items-center gap-1" aria-label={`Countdown: ${displayTime}`}>
        {digits.map((char, i) =>
          char === ":" ? (
            <span
              key={`sep-${i}`}
              className="text-4xl font-bold text-primary mx-1 animate-pulse"
            >
              :
            </span>
          ) : (
            <span
              key={`digit-${i}`}
              className="flex items-center justify-center w-12 h-16 rounded-lg bg-secondary text-3xl font-mono font-bold text-card-foreground md:w-16 md:h-20 md:text-5xl"
            >
              {char}
            </span>
          )
        )}
      </div>
    </div>
  )
}
