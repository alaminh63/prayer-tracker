"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchLocation } from "@/store/locationSlice"
import { fetchPrayerTimes } from "@/store/prayerSlice"
import { setUserId, saveSettings } from "@/store/settingsSlice"
import { v4 as uuidv4 } from "uuid"

export function LocationInitializer() {
  const dispatch = useAppDispatch()
  const { latitude, longitude } = useAppSelector((state) => state.location)
  const settings = useAppSelector((state) => state.settings)
  const { calculationMethod, asrMethod, userId } = settings

  // Initialize unique user ID
  useEffect(() => {
    if (!userId) {
      dispatch(setUserId(uuidv4()))
    }
  }, [userId, dispatch])

  // Initial location fetch
  useEffect(() => {
    dispatch(fetchLocation())
  }, [dispatch])

  // Fetch prayer times when location or calculation settings change (with debounce)
  useEffect(() => {
    if (latitude && longitude) {
      const timer = setTimeout(() => {
        dispatch(fetchPrayerTimes({ 
          latitude, 
          longitude, 
          method: calculationMethod, 
          school: asrMethod 
        }))
      }, 1000) // 1s debounce
      
      return () => clearTimeout(timer)
    }
  }, [latitude, longitude, calculationMethod, asrMethod, dispatch])

  // Persist settings to MongoDB
  useEffect(() => {
    if (!userId) return

    const timer = setTimeout(() => {
      dispatch(saveSettings(settings))
    }, 2000) // 2s debounce

    return () => clearTimeout(timer)
  }, [settings, userId, dispatch])

  return null
}
