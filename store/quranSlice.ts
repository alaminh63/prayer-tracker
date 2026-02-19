import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface LastRead {
  surahNumber: number
  ayahNumber: number
  surahName: string
}

interface QuranState {
  arabicFontSize: number
  translationFontSize: number
  translationEdition: string
  lastRead: LastRead | null
  bookmarks: { surahNumber: number; ayahNumber: number }[]
  // Phase 2: Audio
  activeAudioAyah: { surahNumber: number; ayahNumber: number; totalAyahs?: number } | null
  isPlaying: boolean
  reciter: string
  history: { surahNumber: number; ayahNumber: number; surahName: string; timestamp: number }[]
  isLooping: boolean
}

const initialState: QuranState = {
  arabicFontSize: typeof window !== "undefined" ? Number(localStorage.getItem("quran_arabicFontSize")) || 28 : 28,
  translationFontSize: typeof window !== "undefined" ? Number(localStorage.getItem("quran_translationFontSize")) || 16 : 16,
  translationEdition: typeof window !== "undefined" ? localStorage.getItem("quran_translationEdition") || "bn.bengali" : "bn.bengali",
  lastRead: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("quran_lastRead") || "null") : null,
  bookmarks: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("quran_bookmarks") || "[]") : [],
  activeAudioAyah: null,
  isPlaying: false,
  reciter: typeof window !== "undefined" ? localStorage.getItem("quran_reciter") || "ar.alafasy" : "ar.alafasy",
  history: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("quran_history") || "[]") : [],
  isLooping: typeof window !== "undefined" ? localStorage.getItem("quran_isLooping") === "true" : false,
}

const quranSlice = createSlice({
  name: "quran",
  initialState,
  reducers: {
    setArabicFontSize: (state, action: PayloadAction<number>) => {
      state.arabicFontSize = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_arabicFontSize", action.payload.toString())
      }
    },
    setTranslationFontSize: (state, action: PayloadAction<number>) => {
      state.translationFontSize = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_translationFontSize", action.payload.toString())
      }
    },
    setTranslationEdition: (state, action: PayloadAction<string>) => {
      state.translationEdition = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_translationEdition", action.payload)
      }
    },
    setLastRead: (state, action: PayloadAction<LastRead>) => {
      state.lastRead = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_lastRead", JSON.stringify(action.payload))
      }
      // Automaticaly add to history
      const historyItem = { ...action.payload, timestamp: Date.now() }
      state.history = [historyItem, ...state.history.filter(h => 
        !(h.surahNumber === action.payload.surahNumber && h.ayahNumber === action.payload.ayahNumber)
      )].slice(0, 50) // Keep last 50
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_history", JSON.stringify(state.history))
      }
    },
    addToHistory: (state, action: PayloadAction<LastRead>) => {
      const historyItem = { ...action.payload, timestamp: Date.now() }
      state.history = [historyItem, ...state.history.filter(h => 
        !(h.surahNumber === action.payload.surahNumber && h.ayahNumber === action.payload.ayahNumber)
      )].slice(0, 50)
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_history", JSON.stringify(state.history))
      }
    },
    clearHistory: (state) => {
      state.history = []
      if (typeof window !== "undefined") {
        localStorage.removeItem("quran_history")
      }
    },
    toggleLooping: (state) => {
      state.isLooping = !state.isLooping
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_isLooping", String(state.isLooping))
      }
    },
    toggleBookmark: (state, action: PayloadAction<{ surahNumber: number; ayahNumber: number }>) => {
      const exists = state.bookmarks.find(
        (b) => b.surahNumber === action.payload.surahNumber && b.ayahNumber === action.payload.ayahNumber
      )
      if (exists) {
        state.bookmarks = state.bookmarks.filter(
          (b) => !(b.surahNumber === action.payload.surahNumber && b.ayahNumber === action.payload.ayahNumber)
        )
      } else {
        state.bookmarks.push(action.payload)
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_bookmarks", JSON.stringify(state.bookmarks))
      }
    },
    setActiveAudioAyah: (state, action: PayloadAction<{ surahNumber: number; ayahNumber: number; totalAyahs?: number } | null>) => {
      state.activeAudioAyah = action.payload
      if (action.payload) state.isPlaying = true
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    setReciter: (state, action: PayloadAction<string>) => {
      state.reciter = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("quran_reciter", action.payload)
      }
    },
  },
})

export const {
  setArabicFontSize,
  setTranslationFontSize,
  setTranslationEdition,
  setLastRead,
  toggleBookmark,
  setActiveAudioAyah,
  setIsPlaying,
  setReciter,
  addToHistory,
  clearHistory,
  toggleLooping,
} = quranSlice.actions
export default quranSlice.reducer
