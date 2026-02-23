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
  monthlyTimings: any[] | null
  loading: boolean
  error: string | null
  lastHijriAdjustment: number | null // null = force fresh fetch on startup
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
  monthlyTimings: null,
  loading: false,
  error: null,
  lastHijriAdjustment: null, // null forces a fresh fetch on app startup
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
    params: { latitude: number; longitude: number; method: number; school: number; hijriAdjustment?: number },
    { getState, rejectWithValue }
  ) => {
    const { latitude, longitude, method, school, hijriAdjustment = 0 } = params
    const state = getState() as { prayer: PrayerState }
    
    // Performance: Skip fetch if today's data was already fetched with the same hijriAdjustment
    // lastHijriAdjustment = null means fresh start — always fetch
    const today = new Date().toISOString().split("T")[0]
    if (
      state.prayer.timings &&
      state.prayer.gregorianDate &&
      new Date(state.prayer.gregorianDate).toISOString().split("T")[0] === today &&
      state.prayer.lastHijriAdjustment !== null &&
      state.prayer.lastHijriAdjustment === hijriAdjustment
    ) {
      return null // Already up-to-date, skip
    }

    try {
      const query = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        method: String(method),
        school: String(school),
      })
      if (hijriAdjustment !== 0) query.set("adjustment", String(hijriAdjustment))
      const res = await fetch(`/api/prayer-times?${query.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch prayer times")
      const data = await res.json()
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          date: today,
          data: data
        }))
      }
      
      return { ...data, hijriAdjustment }
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch prayer times"
      )
    }
  }
)

export const fetchMonthlyPrayerTimes = createAsyncThunk(
  "prayer/fetchMonthlyPrayerTimes",
  async (
    params: { latitude: number; longitude: number; method: number; school: number; month?: number; year?: number },
    { rejectWithValue }
  ) => {
    const { latitude, longitude, method, school, month, year } = params
    const query = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      method: method.toString(),
      school: school.toString(),
    })
    if (month) query.append("month", month.toString())
    if (year) query.append("year", year.toString())

    try {
      const res = await fetch(`/api/prayer-times/monthly?${query.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch monthly prayer times")
      return await res.json()
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch monthly prayer times"
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
          state.lastHijriAdjustment = action.payload.hijriAdjustment ?? 0
        }
      })
      .addCase(fetchPrayerTimes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchMonthlyPrayerTimes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMonthlyPrayerTimes.fulfilled, (state, action) => {
        state.loading = false
        state.monthlyTimings = action.payload
      })
      .addCase(fetchMonthlyPrayerTimes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentAndNext, updateTimeLeft } = prayerSlice.actions
export default prayerSlice.reducer
