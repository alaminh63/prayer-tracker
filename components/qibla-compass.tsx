"use client"

import React, { useState, useEffect } from "react"
import { Compass } from "lucide-react"
import { calculateQibla } from "@/lib/qibla-utils"
import { useAppSelector } from "@/store/hooks"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

export function QiblaCompass() {
  const { latitude, longitude } = useAppSelector((state) => state.location)
  const [heading, setHeading] = useState<number | null>(null)
  const [qiblaDirection, setQiblaDirection] = useState<number>(0)
  const [isSupported, setIsSupported] = useState<boolean | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string>("")
  const { t, language } = useTranslation()

  useEffect(() => {
    if (latitude && longitude) {
      setQiblaDirection(calculateQibla(latitude, longitude))
    }
  }, [latitude, longitude])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as any
      const supported = "DeviceOrientationEvent" in win || "ondeviceorientationabsolute" in win
      setIsSupported(supported)
      
      if (!win.isSecureContext) {
        setError(t.common.compass_error_https)
      }
    }
  }, [language])

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let compassHeading: number | null = null

    // iOS support
    if ((event as any).webkitCompassHeading) {
      compassHeading = (event as any).webkitCompassHeading
    } 
    // Android / Chrome support (Absolute orientation)
    else if (event.alpha !== null && (event as any).absolute !== false) {
      compassHeading = 360 - event.alpha
    }

    if (compassHeading !== null) {
      setHeading(compassHeading)
      setDebug(`Heading: ${Math.round(compassHeading)}°`)
    }
  }

  const handleAbsoluteOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setHeading(360 - event.alpha)
      setDebug(`Abs Heading: ${Math.round(360 - event.alpha)}°`)
    }
  }

  const startCompass = async () => {
    if (typeof window === "undefined") return
    const win = window as any

    try {
      // iOS Permission Request
      if (typeof DeviceOrientationEvent !== "undefined" && 
          typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        const response = await (DeviceOrientationEvent as any).requestPermission()
        if (response !== "granted") {
          setError(t.common.compass_error_permission)
          return
        }
      }

      setIsActive(true)
      setError(null)

      if ("ondeviceorientationabsolute" in win) {
        win.addEventListener("deviceorientationabsolute", handleAbsoluteOrientation, true)
      } else if ("DeviceOrientationEvent" in win) {
        win.addEventListener("deviceorientation", handleOrientation, true)
      } else {
        setError(t.common.compass_error_unsupported)
      }
    } catch (err) {
      setError(t.common.compass_error_failed)
      console.error(err)
    }
  }

  useEffect(() => {
    return () => {
      const win = window as any
      if (typeof window !== "undefined") {
        win.removeEventListener("deviceorientationabsolute", handleAbsoluteOrientation)
        win.removeEventListener("deviceorientation", handleOrientation)
      }
    }
  }, [])

  if (!latitude || !longitude) return null

  const rotation = heading !== null ? qiblaDirection - heading : qiblaDirection

  return (
    <div className="flex flex-col items-center gap-6 p-8 glass-card">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-gradient">
          {t.common.qibla_title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t.common.qibla_guide}
        </p>
      </div>

      <div className="relative h-64 w-64 flex items-center justify-center transition-all">
        {/* Compass Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border/50 bg-secondary/20 shadow-inner" />
        
        {/* Compass Dial */}
        <div 
          className="absolute inset-2 rounded-full border border-primary/20 transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${- (heading || 0)}deg)` }}
        >
          {/* North Marker */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-destructive">N</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[10px] font-bold text-muted-foreground">S</div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground">W</div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-[10px] font-bold text-muted-foreground">E</div>
        </div>

        {/* Qibla Needle */}
        <div 
          className="relative h-full w-full transition-transform duration-700 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute top-4 flex flex-col items-center animate-float">
            <div className="h-0 w-0 border-x-[8px] border-x-transparent border-b-[20px] border-b-primary shadow-lg" />
            <Compass className="h-6 w-6 text-primary -mt-1" />
          </div>
        </div>

        {/* Center Point */}
        <div className="h-4 w-4 rounded-full bg-primary border-4 border-background shadow-lg z-10" />
      </div>

      <div className="text-center w-full space-y-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-mono font-bold text-primary">
            {Math.round(qiblaDirection)}° {t.common.from_north}
          </p>
          {debug && (
            <p className="text-[10px] font-mono text-muted-foreground opacity-50">
              Current: {debug}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          {!isActive && !error && (
            <button
              onClick={startCompass}
              className="btn-premium py-3 px-8 text-sm flex items-center justify-center gap-2"
            >
              <Compass className="h-4 w-4" />
              {t.common.start_compass}
            </button>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-[11px] text-destructive">
              {error}
            </div>
          )}
          
          <div className="flex items-start gap-2 bg-secondary/30 p-3 rounded-xl text-[10px] text-muted-foreground text-left">
            <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold">!</div>
            <p>
              {t.common.compass_permission_guide}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
