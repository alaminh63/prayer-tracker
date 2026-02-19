import { configureStore } from "@reduxjs/toolkit"
import locationReducer from "./locationSlice"
import prayerReducer from "./prayerSlice"
import settingsReducer from "./settingsSlice"
import quranReducer from "./quranSlice"
import hadithReducer from "./hadithSlice"

export const store = configureStore({
  reducer: {
    location: locationReducer,
    prayer: prayerReducer,
    settings: settingsReducer,
    quran: quranReducer,
    hadith: hadithReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
