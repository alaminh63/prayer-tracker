"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchLocation, setShowSoftPrompt } from "@/store/locationSlice"
import { fetchPrayerTimes, setCurrentAndNext } from "@/store/prayerSlice"
import { getCurrentAndNextPrayer } from "@/lib/prayer-utils"
import { setUserId, saveSettings } from "@/store/settingsSlice"
import { v4 as uuidv4 } from "uuid"

export function LocationInitializer() {
  const dispatch = useAppDispatch()
  const { latitude, longitude } = useAppSelector((state) => state.location)
  const settings = useAppSelector((state) => state.settings)
  const { calculationMethod, asrMethod, hijriOffset, userId } = settings

  // Initialize unique user ID
  useEffect(() => {
    if (!userId) {
      dispatch(setUserId(uuidv4()))
    }
  }, [userId, dispatch])

  // Initial location fetch
  useEffect(() => {
    // If we don't have location yet and haven't denied it, show the soft prompt
    if (!latitude && !longitude) {
      // Small delay to let the app load smoothly
      const timer = setTimeout(() => {
        dispatch(setShowSoftPrompt(true))
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [latitude, longitude, dispatch])

  // Fetch prayer times when location or calculation settings change (with debounce)
  useEffect(() => {
    if (latitude && longitude) {
      const timer = setTimeout(() => {
        dispatch(fetchPrayerTimes({ 
          latitude, 
          longitude, 
          method: calculationMethod, 
          school: asrMethod,
          hijriAdjustment: hijriOffset,
        }))
      }, 1000) // 1s debounce
      
      return () => clearTimeout(timer)
    }
  }, [latitude, longitude, calculationMethod, asrMethod, hijriOffset, dispatch])

  // Persist settings to MongoDB
  useEffect(() => {
    if (!userId) return

    const timer = setTimeout(() => {
      dispatch(saveSettings(settings))
    }, 2000) // 2s debounce

    return () => clearTimeout(timer)
  }, [settings, userId, dispatch])

  // Global prayer timing updates (Current/Next prayer calculation)
  const timings = useAppSelector((state) => state.prayer.timings)
  useEffect(() => {
    if (!timings) return

    const updatePrayers = () => {
      const { current, next, timeLeft } = getCurrentAndNextPrayer(timings)
      dispatch(setCurrentAndNext({ current, next, timeLeft }))
    }

    updatePrayers()
    const timer = setInterval(updatePrayers, 60000) // Every minute

    return () => clearInterval(timer)
  }, [timings, dispatch])

  return null
}
