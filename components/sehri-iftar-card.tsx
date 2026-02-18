"use client"

import { useAppSelector } from "@/store/hooks"
import { Moon, Sun } from "lucide-react"

export function SehriIftarCard() {
  const { timings, loading } = useAppSelector((state) => state.prayer)

  if (loading || !timings) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-xl bg-secondary p-6 animate-pulse"
          >
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-8 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-secondary p-6 border border-border">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          <Moon className="h-6 w-6 text-primary" />
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sehri End
        </p>
        <p className="text-2xl font-bold text-card-foreground">
          {timings.Fajr}
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-xl bg-secondary p-6 border border-border">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
          <Sun className="h-6 w-6 text-accent" />
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Iftar
        </p>
        <p className="text-2xl font-bold text-card-foreground">
          {timings.Maghrib}
        </p>
      </div>
    </div>
  )
}
