"use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchLocation } from "@/store/locationSlice"
import { MapPin, RefreshCw } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export function LocationDisplay() {
  const dispatch = useAppDispatch()
  const { latitude, longitude, city, loading, permissionDenied } =
    useAppSelector((state) => state.location)
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
      {loading ? (
        <span>{t.common.detecting_location}</span>
      ) : permissionDenied ? (
        <span>
          {city || "Dhaka"} ({t.common.location_default})
        </span>
      ) : latitude && longitude ? (
        <span>
          {city || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`}
        </span>
      ) : (
        <span>{t.common.location_unavailable}</span>
      )}
      <button
        onClick={() => dispatch(fetchLocation())}
        className="ml-1 inline-flex items-center justify-center rounded-full p-1 hover:bg-secondary transition-colors"
        aria-label={t.common.refresh_location}
        disabled={loading}
      >
        <RefreshCw
          className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
