import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface LocationState {
  latitude: number | null
  longitude: number | null
  city: string | null
  loading: boolean
  error: string | null
  permissionDenied: boolean
  showSoftPrompt: boolean
}

const LOCATION_CACHE_KEY = "salat_location_cache"

// Load persisted location from localStorage on startup
const loadPersistedLocation = (): Pick<LocationState, "latitude" | "longitude" | "city"> => {
  if (typeof window === "undefined") return { latitude: null, longitude: null, city: null }
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.latitude && parsed.longitude) {
        return { latitude: parsed.latitude, longitude: parsed.longitude, city: parsed.city || null }
      }
    }
  } catch {
    // ignore
  }
  return { latitude: null, longitude: null, city: null }
}

// Persist location to localStorage
const persistLocation = (latitude: number, longitude: number, city: string) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ latitude, longitude, city }))
  } catch {
    // ignore
  }
}

const persisted = loadPersistedLocation()

const initialState: LocationState = {
  latitude: persisted.latitude,
  longitude: persisted.longitude,
  city: persisted.city,
  loading: false,
  error: null,
  permissionDenied: false,
  showSoftPrompt: false, // never show on reload if location is cached
}

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async (_, { rejectWithValue }) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return rejectWithValue("Geolocation is not supported by this browser")
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000,
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse Geocoding to get City Name
      let city = "Unknown Location"
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await res.json()
        city = data.city || data.locality || data.principalSubdivision || "Unknown Location"
      } catch (err) {
        console.error("Reverse geocoding failed:", err)
      }

      // Persist to localStorage so next reload skips the prompt
      persistLocation(latitude, longitude, city)

      return { latitude, longitude, city }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get location")
    }
  }
)

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload
    },
    setManualLocation: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) => {
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
      state.error = null
      state.permissionDenied = false
      // Also persist manual location
      persistLocation(action.payload.latitude, action.payload.longitude, state.city || "")
    },
    setShowSoftPrompt: (state, action: PayloadAction<boolean>) => {
      state.showSoftPrompt = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.loading = false
        state.latitude = action.payload.latitude
        state.longitude = action.payload.longitude
        state.city = action.payload.city
        state.permissionDenied = false
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.permissionDenied = true
        // Fallback to Dhaka — also persist so next reload uses this
        state.latitude = 23.8103
        state.longitude = 90.4125
        state.city = "Dhaka"
        persistLocation(23.8103, 90.4125, "Dhaka")
      })
  },
})

export const { setCity, setManualLocation, setShowSoftPrompt } = locationSlice.actions
export default locationSlice.reducer
