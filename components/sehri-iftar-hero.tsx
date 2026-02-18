"use client"

import { useAppSelector } from "@/store/hooks"
import { useTranslation } from "@/hooks/use-translation"
import { Moon, Sun } from "lucide-react"

export function SehriIftarHero() {
  const { timings, loading } = useAppSelector((state) => state.prayer)
  const { t } = useTranslation()

  if (loading || !timings) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-5 animate-pulse"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted/30" />
              <div className="h-3 w-14 rounded bg-muted/30" />
              <div className="h-7 w-16 rounded bg-muted/30" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Sehri Card */}
      <div className="group relative overflow-hidden rounded-2xl glass-card p-5 transition-all hover:border-primary/30">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl -translate-y-6 translate-x-6 group-hover:bg-primary/10 transition-colors" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Moon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {t.prayers.sehri_ends}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1 font-mono tabular-nums">
              {timings.Fajr}
            </p>
          </div>
        </div>
      </div>

      {/* Iftar Card */}
      <div className="group relative overflow-hidden rounded-2xl glass-card p-5 transition-all hover:border-accent/30">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-accent/5 blur-2xl -translate-y-6 translate-x-6 group-hover:bg-accent/10 transition-colors" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
            <Sun className="h-5 w-5 text-accent" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {t.prayers.iftar_time}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1 font-mono tabular-nums">
              {timings.Maghrib}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
