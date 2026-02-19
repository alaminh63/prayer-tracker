"use client"

import React, { useEffect, useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { useAppDispatch } from "@/store/hooks"
import { fetchLocation } from "@/store/locationSlice"
import { MapPin, RefreshCw, Calendar } from "lucide-react"

export function PageHeader({
  title,
  subtitle,
  showLocation = true,
  showDate = true,
}: {
  title: React.ReactNode
  subtitle?: string
  showLocation?: boolean
  showDate?: boolean
}) {
  const dispatch = useAppDispatch()
  const { latitude, longitude, city, loading: locLoading, permissionDenied } =
    useAppSelector((state) => state.location)
  const { hijriDate, hijriMonth, hijriYear, gregorianDate, loading: prayerLoading } =
    useAppSelector((state) => state.prayer)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const locationText = locLoading
    ? "Detecting..."
    : permissionDenied
      ? city || "Dhaka"
      : city || (latitude ? `${latitude.toFixed(2)}, ${longitude?.toFixed(2)}` : "...")

  return (
    <header className="px-4 pt-6 pb-4 lg:px-8 lg:pt-8 lg:pb-6">
      <div className="">
        {/* Title Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight lg:text-3xl text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {/* Mosque icon visible only on mobile */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 lg:hidden shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            >
              <path d="M12 2C8 6 4 10 4 14v6a2 2 0 002 2h12a2 2 0 002-2v-6c0-4-4-8-8-12z" />
              <path d="M12 22v-6" />
              <path d="M9 22v-3a3 3 0 016 0v3" />
            </svg>
          </div>
        </div>

        {/* Location + Date chips */}
        {mounted && (showLocation || showDate) && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {showLocation && (
              <div className="flex items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate max-w-[140px]">{locationText}</span>
                <button
                  onClick={() => dispatch(fetchLocation())}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted/50 transition-colors"
                  aria-label="Refresh location"
                  disabled={locLoading}
                >
                  <RefreshCw
                    className={`h-3 w-3 ${locLoading ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
            {showDate && !prayerLoading && hijriDate && (
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/15 px-3 py-1.5 text-xs text-primary">
                <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>
                  {hijriDate} {hijriMonth} {hijriYear}
                </span>
              </div>
            )}
            {showDate && !prayerLoading && gregorianDate && (
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                {gregorianDate}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
