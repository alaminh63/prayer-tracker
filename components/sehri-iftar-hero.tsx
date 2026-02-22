import { useState, useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import { useTranslation } from "@/hooks/use-translation"
import { Moon, Sun, Clock } from "lucide-react"
import { getTimeDiff, formatCountdown, formatTime12 } from "@/lib/prayer-utils"

export function SehriIftarHero() {
  const { timings, loading } = useAppSelector((state) => state.prayer)
  const { t } = useTranslation()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !timings) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="glass-card rounded-3xl p-5 animate-pulse border border-white/5"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-muted/20" />
              <div className="h-3 w-14 rounded bg-muted/20" />
              <div className="h-7 w-16 rounded bg-muted/20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Calculate remaining times
  const sehriDiff = getTimeDiff(timings.Fajr)
  const iftarDiff = getTimeDiff(timings.Maghrib)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Sehri Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-zinc-950/40 border border-white/5 p-5 transition-all hover:border-primary/30 backdrop-blur-xl ring-1 ring-white/5">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
            <Moon className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
              {t.prayers.sehri_ends}
            </p>
            <p className="text-xl font-black text-white font-mono tabular-nums tracking-tighter">
              {formatTime12(timings.Fajr)}
            </p>
            {sehriDiff > 0 && (
              <div className="mt-2 flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <Clock className="h-2.5 w-2.5 text-primary" />
                <span className="text-[9px] font-black text-primary tabular-nums">{formatCountdown(sehriDiff)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Iftar Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-zinc-950/40 border border-white/5 p-5 transition-all hover:border-accent/30 backdrop-blur-xl ring-1 ring-white/5">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-colors" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent group-hover:scale-110 transition-transform">
            <Sun className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
              {t.prayers.iftar_time}
            </p>
            <p className="text-xl font-black text-white font-mono tabular-nums tracking-tighter">
              {formatTime12(timings.Maghrib)}
            </p>
            {iftarDiff > 0 && (
              <div className="mt-2 flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                <Clock className="h-2.5 w-2.5 text-accent" />
                <span className="text-[9px] font-black text-accent tabular-nums">{formatCountdown(iftarDiff)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
