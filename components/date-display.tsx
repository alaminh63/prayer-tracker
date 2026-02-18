"use client"

import { useAppSelector } from "@/store/hooks"
import { Calendar } from "lucide-react"

export function DateDisplay() {
  const { hijriDate, hijriMonth, hijriYear, gregorianDate, loading } =
    useAppSelector((state) => state.prayer)

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-1 animate-pulse">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-3 w-32 rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {hijriDate && hijriMonth && hijriYear && (
        <div className="flex items-center gap-2 text-primary">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <p className="text-sm font-semibold">
            {hijriDate} {hijriMonth} {hijriYear} AH
          </p>
        </div>
      )}
      {gregorianDate && (
        <p className="text-xs text-muted-foreground">{gregorianDate}</p>
      )}
    </div>
  )
}
