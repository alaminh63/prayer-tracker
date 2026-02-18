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
import { useTranslation } from "@/hooks/use-translation"

const PRAYER_ICONS: Record<PrayerName, string> = {
  Fajr: "M12 3v1m0 16v1m-9-9H2m20 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z",
  Dhuhr:
    "M12 2v2m0 16v2m8-10h2M2 12h2m14.485-6.485l1.414-1.414M4.1 19.9l1.414-1.414m14.385 1.414l-1.414-1.414M4.1 4.1l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z",
  Asr: "M12 3v1m0 16v1m-9-9H2m20 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z",
  Maghrib:
    "M17 12a5 5 0 01-10 0H3v1a9 9 0 0018 0v-1h-4zm-5-9v2m-7 7H3m18 0h-2M7.05 7.05L5.636 5.636m12.728 0L16.95 7.05",
  Isha: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
}

function PrayerIcon({ name, className }: { name: PrayerName; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PRAYER_ICONS[name]} />
    </svg>
  )
}

export function PrayerList() {
  const { timings, currentPrayer, nextPrayer, loading } = useAppSelector(
    (state) => state.prayer
  )
  const { t } = useTranslation()

  if (loading || !timings) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted/30" />
              <div className="flex flex-col gap-1.5">
                <div className="h-3.5 w-16 rounded bg-muted/30" />
                <div className="h-2.5 w-10 rounded bg-muted/30" />
              </div>
            </div>
            <div className="h-5 w-14 rounded bg-muted/30" />
          </div>
        ))}
      </div>
    )
  }

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
    <div className="flex flex-col gap-2">
      {PRAYER_NAMES.map((name) => {
        const isActive = currentPrayer === name
        const isNext = nextPrayer === name
        const prayerTime = parseTimeString(timings[name])
        const isPast = new Date() > prayerTime && !isActive

        return (
          <div
            key={name}
            className={cn(
              "flex items-center justify-between rounded-xl p-4 transition-all group",
              isNext
                ? "glass-card border-primary/30 bg-primary/5"
                : isActive
                  ? "glass-card border-accent/20 bg-accent/5"
                  : isPast
                    ? "bg-secondary/30 border border-transparent opacity-50"
                    : "bg-secondary/50 border border-transparent hover:bg-secondary/70"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  isNext
                    ? "bg-primary/15 text-primary"
                    : isActive
                      ? "bg-accent/15 text-accent"
                      : "bg-muted/50 text-muted-foreground"
                )}
              >
                <PrayerIcon name={name} />
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold leading-tight",
                    isNext
                      ? "text-primary"
                      : isActive
                        ? "text-accent"
                        : "text-foreground"
                  )}
                >
                  {t.prayers[getPrayerKey(name)]}
                </p>
                <p className="text-[11px] text-muted-foreground font-serif leading-tight mt-0.5">
                  {PRAYER_ARABIC[name]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isNext && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {t.prayers.next_prayer}
                </span>
              )}
              <span
                className={cn(
                  "text-base font-mono font-bold tabular-nums",
                  isNext
                    ? "text-primary text-glow-gold"
                    : isActive
                      ? "text-accent"
                      : "text-foreground"
                )}
              >
                {timings[name]}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
