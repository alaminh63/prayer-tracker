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
import { useTranslation } from "@/hooks/use-translation"

import { Sun, Sunrise, CloudSun, Sunset, Moon, Clock, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const PRAYER_ICONS: Record<PrayerName, any> = {
  Fajr: DawnIcon,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
}

function DawnIcon(props: any) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M12 11c1.7 0 3 1.3 3 3v2H9v-2c0-1.7 1.3-3 3-3Z" />
      <path d="M22 22H2" />
      <path d="m19.1 4.9-1.4 1.4" />
      <path d="M22 12h-2" />
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
          <div key={i} className="flex items-center justify-between rounded-xl bg-secondary p-4 animate-pulse">
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
    <div className="flex flex-col gap-3">
      {PRAYER_NAMES.map((name) => {
        const isActive = currentPrayer === name
        const isNext = nextPrayer === name
        const prayerTime = parseTimeString(timings[name])
        const isPast = new Date() > prayerTime && !isActive
        const Icon = PRAYER_ICONS[name as PrayerName] || Clock

        return (
          <motion.div
            key={name}
            initial={false}
            animate={{ 
              scale: isNext ? 1.02 : 1,
              backgroundColor: isNext ? "rgba(var(--primary), 0.08)" : isActive ? "rgba(var(--accent), 0.05)" : "var(--card)"
            }}
            className={cn(
              "relative flex items-center justify-between rounded-3xl p-5 md:p-6 transition-all border overflow-hidden",
              isNext
                ? "border-primary/40 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)] ring-1 ring-primary/20"
                : isActive
                  ? "border-accent/20 bg-accent/5"
                  : isPast
                    ? "border-border opacity-40 grayscale-[0.5]"
                    : "border-border hover:border-primary/20"
            )}
          >
            {/* Active Highlight Glow */}
            {isNext && (
              <div className="absolute inset-0 bg-primary/5 blur-3xl animate-pulse -z-10" />
            )}

            <div className="flex items-center gap-5">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500",
                  isNext
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 rotate-3"
                    : isActive
                      ? "bg-accent/20 text-accent -rotate-3"
                      : "bg-muted/30 text-muted-foreground group-hover:bg-muted/50"
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </div>

              <div className="flex flex-col gap-1">
                <p
                  className={cn(
                    "text-lg font-black tracking-tight",
                    isNext
                      ? "text-primary"
                      : isActive
                        ? "text-accent"
                        : "text-foreground"
                  )}
                >
                  {t.prayers[getPrayerKey(name)]}
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-normal font-arabic flex items-center gap-2">
                  <span className="opacity-50">•</span> {PRAYER_ARABIC[name]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AnimatePresence>
                {isNext && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-black text-primary uppercase tracking-normal border border-primary/20 backdrop-blur-md"
                  >
                    <Sparkles className="h-3 w-3 fill-primary" />
                    পরবর্তী নামাজ
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex flex-col items-end">
                <span
                  className={cn(
                    "text-2xl font-black tabular-nums tracking-tighter",
                    isNext
                      ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                      : isActive
                        ? "text-accent"
                        : isPast 
                          ? "text-muted-foreground/50"
                          : "text-foreground"
                  )}
                >
                  {formatTime12(timings[name])}
                </span>
                {isActive && (
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest animate-pulse">
                    চলছে
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
