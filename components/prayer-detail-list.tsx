"use client"

import { useAppSelector } from "@/store/hooks"
import {
  PRAYER_NAMES,
  PRAYER_LABELS,
  PRAYER_ARABIC,
  parseTimeString,
  formatTime12,
  type PrayerName,
} from "@/lib/prayer-utils"
import { cn } from "@/lib/utils"
import { Sunrise } from "lucide-react"

export function PrayerDetailList() {
  const { timings, currentPrayer, nextPrayer, loading } = useAppSelector(
    (state) => state.prayer
  )

  if (loading || !timings) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-secondary p-5 animate-pulse"
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-5 w-24 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
              <div className="h-7 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Include Sunrise in the detail view
  const allTimes: {
    name: string
    label: string
    arabic: string
    time: string
    isNext: boolean
    isCurrent: boolean
  }[] = [
    ...PRAYER_NAMES.map((name) => ({
      name,
      label: PRAYER_LABELS[name],
      arabic: PRAYER_ARABIC[name],
      time: timings[name],
      isNext: nextPrayer === name,
      isCurrent: currentPrayer === name,
    })),
  ]

  // Insert Sunrise after Fajr
  const sunriseIndex = allTimes.findIndex((t) => t.name === "Fajr") + 1
  allTimes.splice(sunriseIndex, 0, {
    name: "Sunrise",
    label: "Sunrise",
    arabic: "\u0634\u0631\u0648\u0642",
    time: timings.Sunrise,
    isNext: false,
    isCurrent: false,
  })

  return (
    <div className="flex flex-col gap-4 mt-4">
      {allTimes.map((prayer) => {
        const timeDate = parseTimeString(prayer.time)
        const isPast = new Date() > timeDate && !prayer.isCurrent

        return (
          <div
            key={prayer.name}
            className={cn(
              "rounded-xl p-5 border transition-all",
              prayer.isNext
                ? "bg-primary/10 border-primary/40"
                : prayer.isCurrent
                  ? "bg-accent/10 border-accent/30"
                  : isPast
                    ? "bg-secondary/50 border-border opacity-60"
                    : "bg-secondary border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {prayer.name === "Sunrise" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                    <Sunrise className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                      prayer.isNext
                        ? "bg-primary/20 text-primary"
                        : prayer.isCurrent
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {prayer.label.charAt(0)}
                  </div>
                )}
                <div>
                  <p
                    className={cn(
                      "font-semibold text-base",
                      prayer.isNext ? "text-primary" : "text-card-foreground"
                    )}
                  >
                    {prayer.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {prayer.arabic}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-xl font-mono font-bold",
                    prayer.isNext ? "text-primary" : "text-card-foreground"
                  )}
                >
                  {formatTime12(prayer.time)}
                </p>
              </div>
            </div>
            {prayer.isNext && (
              <div className="mt-3 pt-3 border-t border-primary/20">
                <p className="text-xs text-primary font-medium">
                  Coming up next
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
