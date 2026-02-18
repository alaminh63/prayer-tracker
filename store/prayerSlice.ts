import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PrayerTimes, PrayerName } from "@/lib/prayer-utils"

interface PrayerState {
  timings: PrayerTimes | null
  hijriDate: string | null
  hijriMonth: string | null
  hijriYear: string | null
  gregorianDate: string | null
  currentPrayer: PrayerName | null
  nextPrayer: PrayerName | null
  timeLeft: number
  loading: boolean
  error: string | null
}

const initialState: PrayerState = {
  timings: null,
  hijriDate: null,
  hijriMonth: null,
  hijriYear: null,
  gregorianDate: null,
  currentPrayer: null,
  nextPrayer: null,
  timeLeft: 0,
  loading: false,
  error: null,
}

const CACHE_KEY = "salat_prayer_cache"

const loadInitialState = (): PrayerState => {
  const baseState = { ...initialState }
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        // Check if cached data is for today
        const today = new Date().toISOString().split("T")[0]
        if (parsed.date === today) {
          return { ...baseState, ...parsed.data }
        }
      }
    } catch (e) {
      console.error("Failed to load prayer cache", e)
    }
  }
  return baseState
}

export const fetchPrayerTimes = createAsyncThunk(
  "prayer/fetchPrayerTimes",
  async (
    params: { latitude: number; longitude: number; method: number; school: number },
    { getState, rejectWithValue }
  ) => {
    const { latitude, longitude, method, school } = params
    const state = getState() as { prayer: PrayerState }
    
    // Performance: Don't fetch if we already have timings for today
    const today = new Date().toISOString().split("T")[0]
    if (
      state.prayer.timings && 
      state.prayer.gregorianDate && 
      new Date(state.prayer.gregorianDate).toISOString().split("T")[0] === today
    ) {
      // Basic param check could be added here if needed, but usually location doesn't jump
      return null // Indicate we don't need to update
    }

    try {
      const res = await fetch(
        `/api/prayer-times?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`
      )
      if (!res.ok) throw new Error("Failed to fetch prayer times")
      const data = await res.json()
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          date: today,
          data: data
        }))
      }
      
      return data
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch prayer times"
      )
    }
  }
)

const prayerSlice = createSlice({
  name: "prayer",
  initialState: loadInitialState(),
  reducers: {
    setCurrentAndNext: (state, action) => {
      state.currentPrayer = action.payload.current
      state.nextPrayer = action.payload.next
      state.timeLeft = action.payload.timeLeft
    },
    updateTimeLeft: (state, action) => {
      state.timeLeft = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrayerTimes.pending, (state) => {
        // Only set loading if we don't have timings yet (to avoid flicker)
        if (!state.timings) {
          state.loading = true
        }
        state.error = null
      })
      .addCase(fetchPrayerTimes.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.timings = action.payload.timings
          state.hijriDate = action.payload.hijriDate
          state.hijriMonth = action.payload.hijriMonth
          state.hijriYear = action.payload.hijriYear
          state.gregorianDate = action.payload.gregorianDate
        }
      })
      .addCase(fetchPrayerTimes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentAndNext, updateTimeLeft } = prayerSlice.actions
export default prayerSlice.reducer
