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
    if (!navigator.geolocation) {
      return rejectWithValue("Geolocation is not supported by this browser")
    }

    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(rejectWithValue(error.message))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      )
    })
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
