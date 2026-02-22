import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface LocationState {
  latitude: number | null
  longitude: number | null
  city: string | null
  loading: boolean
  error: string | null
  permissionDenied: boolean
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  city: null,
  loading: false,
  error: null,
  permissionDenied: false,
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
        // Fallback to Dhaka
        state.latitude = 23.8103
        state.longitude = 90.4125
        state.city = "Dhaka"
      })
  },
})

export const { setCity, setManualLocation } = locationSlice.actions
export default locationSlice.reducer
