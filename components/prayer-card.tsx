"use client"

import { useAppSelector } from "@/store/hooks"
import {
  PRAYER_NAMES,
  PRAYER_LABELS,
  PRAYER_ARABIC,
  formatTime12,
  type PrayerName,
} from "@/lib/prayer-utils"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

function PrayerIcon({ name }: { name: PrayerName }) {
  const iconMap: Record<PrayerName, string> = {
    Fajr: "M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636",
    Dhuhr:
      "M12 2v2m0 16v2m8-10h2M2 12h2m14.485-6.485l1.414-1.414M4.1 19.9l1.414-1.414m14.385 1.414l-1.414-1.414M4.1 4.1l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z",
    Asr: "M12 3v1m0 16v1m-9-9H2m20 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707M5.636 18.364l.707-.707m11.314-11.314l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z",
    Maghrib:
      "M17 12a5 5 0 01-10 0H3v1a9 9 0 0018 0v-1h-4zm-5-9v2m-7 7H3m18 0h-2M7.05 7.05L5.636 5.636m12.728 0L16.95 7.05",
    Isha: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconMap[name]} />
    </svg>
  )
}

export function PrayerCard() {
  const { timings, currentPrayer, nextPrayer, loading } = useAppSelector(
    (state) => state.prayer
  )

  if (loading || !timings) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-secondary p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
            <div className="h-4 w-14 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {PRAYER_NAMES.map((name) => {
        const isActive = currentPrayer === name
        const isNext = nextPrayer === name

        return (
          <div
            key={name}
            className={cn(
              "flex items-center justify-between p-5 glass-card",
              isNext
                ? "border-primary/40 ring-1 ring-primary/20 shadow-lg shadow-primary/5"
                : isActive
                  ? "border-accent/30 shadow-md"
                  : "border-border/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500",
                  isNext
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 rotate-3"
                    : isActive
                      ? "bg-accent/20 text-accent -rotate-3"
                      : "bg-muted text-muted-foreground"
                )}
              >
                <PrayerIcon name={name} />
              </div>
              <div className="space-y-0.5">
                <p
                  className={cn(
                    "text-base font-bold tracking-tight",
                    isNext
                      ? "text-primary"
                      : isActive
                        ? "text-accent"
                        : "text-card-foreground"
                  )}
                >
                  {PRAYER_LABELS[name]}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                  {PRAYER_ARABIC[name]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isNext && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary animate-pulse-soft">
                  <Clock className="h-3 w-3" />
                  Upcoming
                </span>
              )}
              <span
                className={cn(
                  "text-xl font-mono font-black tracking-tighter",
                  isNext
                    ? "text-primary scale-110"
                    : isActive
                      ? "text-accent"
                      : "text-card-foreground/80"
                )}
              >
                {formatTime12(timings[name])}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
