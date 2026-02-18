import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface SettingsState {
  userId: string | null
  azanAlert: boolean
  sehriAlert: boolean
  iftarAlert: boolean
  autoLocation: boolean
  calculationMethod: number
  asrMethod: 0 | 1 // 0: Standard, 1: Hanafi
  hijriOffset: number
  language: "en" | "bn"
  notificationPermission: NotificationPermission | "default"
}

const initialState: SettingsState = {
  userId: typeof window !== "undefined" ? localStorage.getItem("salat_userId") : null,
  azanAlert: true,
  sehriAlert: true,
  iftarAlert: true,
  autoLocation: true,
  calculationMethod: 2,
  asrMethod: 1, 
  hijriOffset: 0,
  language: "bn",
  notificationPermission: "default",
}

export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (settings: Partial<SettingsState>, { getState }) => {
    const state = getState() as { settings: SettingsState }
    const userId = state.settings.userId
    if (!userId) return

    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...settings }),
    })
  }
)

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("salat_userId", action.payload)
      }
    },
    toggleAzanAlert: (state) => {
      state.azanAlert = !state.azanAlert
    },
    toggleSehriAlert: (state) => {
      state.sehriAlert = !state.sehriAlert
    },
    toggleIftarAlert: (state) => {
      state.iftarAlert = !state.iftarAlert
    },
    toggleAutoLocation: (state) => {
      state.autoLocation = !state.autoLocation
    },
    setCalculationMethod: (state, action: PayloadAction<number>) => {
      state.calculationMethod = action.payload
    },
    setAsrMethod: (state, action: PayloadAction<0 | 1>) => {
      state.asrMethod = action.payload
    },
    setHijriOffset: (state, action: PayloadAction<number>) => {
      state.hijriOffset = action.payload
    },
    setLanguage: (state, action: PayloadAction<"en" | "bn">) => {
      state.language = action.payload
    },
    setNotificationPermission: (
      state,
      action: PayloadAction<NotificationPermission>
    ) => {
      state.notificationPermission = action.payload
    },
  },
})

export const {
  setUserId,
  toggleAzanAlert,
  toggleSehriAlert,
  toggleIftarAlert,
  toggleAutoLocation,
  setCalculationMethod,
  setAsrMethod,
  setHijriOffset,
  setLanguage,
  setNotificationPermission,
} = settingsSlice.actions
export default settingsSlice.reducer
