"use client"

import { useAppSelector } from "@/store/hooks"
import {
  PRAYER_NAMES,
  PRAYER_LABELS,
  PRAYER_ARABIC,
  parseTimeString,
  type PrayerName,
} from "@/lib/prayer-utils"
import { cn } from "@/lib/utils"
import { Sunrise, Clock } from "lucide-react"

export function PrayerDetailGrid() {
  const { timings, currentPrayer, nextPrayer, loading } = useAppSelector(
    (state) => state.prayer
  )

  if (loading || !timings) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted/30" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-20 rounded bg-muted/30" />
                  <div className="h-3 w-12 rounded bg-muted/30" />
                </div>
              </div>
              <div className="h-8 w-24 rounded bg-muted/30 self-end" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  type PrayerItem = {
    name: string
    label: string
    arabic: string
    time: string
    isNext: boolean
    isCurrent: boolean
    isSunrise: boolean
  }

  const allTimes: PrayerItem[] = PRAYER_NAMES.map((name) => ({
    name,
    label: PRAYER_LABELS[name],
    arabic: PRAYER_ARABIC[name],
    time: timings[name],
    isNext: nextPrayer === name,
    isCurrent: currentPrayer === name,
    isSunrise: false,
  }))

  // Insert Sunrise after Fajr
  const sunriseIndex = allTimes.findIndex((t) => t.name === "Fajr") + 1
  allTimes.splice(sunriseIndex, 0, {
    name: "Sunrise",
    label: "Sunrise",
    arabic: "\u0634\u0631\u0648\u0642",
    time: timings.Sunrise,
    isNext: false,
    isCurrent: false,
    isSunrise: true,
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-2">
      {allTimes.map((prayer) => {
        const timeDate = parseTimeString(prayer.time)
        const isPast = new Date() > timeDate && !prayer.isCurrent
        const period = timeDate.getHours() >= 12 ? "PM" : "AM"
        const hours12 = timeDate.getHours() % 12 || 12
        const minutes = timeDate.getMinutes().toString().padStart(2, "0")

        return (
          <div
            key={prayer.name}
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 transition-all group",
              prayer.isNext
                ? "glass-card-strong border-primary/30"
                : prayer.isCurrent
                  ? "glass-card border-accent/20"
                  : isPast
                    ? "bg-secondary/20 border border-transparent opacity-50"
                    : "glass-card"
            )}
          >
            {/* Glow effect for next prayer */}
            {prayer.isNext && (
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            )}

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                {prayer.isSunrise ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/15">
                    <Sunrise className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold",
                      prayer.isNext
                        ? "bg-primary/15 border-primary/20 text-primary"
                        : prayer.isCurrent
                          ? "bg-accent/15 border-accent/20 text-accent"
                          : "bg-muted/30 border-border text-muted-foreground"
                    )}
                  >
                    {prayer.label.charAt(0)}
                  </div>
                )}
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      prayer.isNext ? "text-primary" : "text-foreground"
                    )}
                  >
                    {prayer.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-serif mt-0.5">
                    {prayer.arabic}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "text-2xl font-mono font-black tabular-nums tracking-tight",
                    prayer.isNext ? "text-primary text-glow-gold" : "text-foreground"
                  )}
                >
                  {`${hours12}:${minutes}`}
                  <span className="text-[10px] ml-1 text-muted-foreground uppercase font-sans font-bold">
                    {period}
                  </span>
                </p>
              </div>
            </div>

            {prayer.isNext && (
              <div className="relative mt-3 pt-3 border-t border-primary/15 flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-primary" />
                <p className="text-[11px] text-primary font-medium">
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
