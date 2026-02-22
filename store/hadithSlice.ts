import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Hadith {
  hadithnumber: number
  text: string
  grades: { name: string; grade: string }[]
}

interface HadithBook {
  name: string
  id: string
}

interface HadithState {
  dailyHadith: {
    hadith: Hadith | null
    book: string | null
    lastUpdated: string | null
  }
  books: HadithBook[]
  currentBookContent: Hadith[]
  loading: boolean
  error: string | null
}

const initialState: HadithState = {
  dailyHadith: {
    hadith: null,
    book: null,
    lastUpdated: null,
  },
  books: [
    { id: "ben-bukhari", name: "Sahih Bukhari" },
    { id: "ben-muslim", name: "Sahih Muslim" },
    { id: "ben-abudawud", name: "Sunan Abu Dawud" },
    { id: "ben-tirmidhi", name: "Jami at-Tirmidhi" },
    { id: "ben-nasai", name: "Sunan an-Nasa'i" },
    { id: "ben-ibnmajah", name: "Sunan Ibn Majah" },
  ],
  currentBookContent: [],
  loading: false,
  error: null,
}

const CACHE_KEY = "salat_hadith_daily"

export const fetchDailyHadith = createAsyncThunk(
  "hadith/fetchDaily",
  async (options: { language: string; force?: boolean } | undefined, { getState }) => {
    const language = options?.language || "bn"
    const force = options?.force || false
    const today = new Date().toISOString().split("T")[0]
    const state = getState() as { hadith: HadithState }
    
    // Return cached if still today and not forced
    if (!force && state.hadith.dailyHadith.lastUpdated === today && state.hadith.dailyHadith.hadith) {
      return null
    }

    // Attempt to load from localStorage first if Redux state is empty and not forced
    if (!force && typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.lastUpdated === today) {
          return parsed
        }
      }
    }

    // Pick a random book
    const books = state.hadith.books
    const randomBook = books[Math.floor(Math.random() * books.length)]
    
    // Construct API ID based on language
    // Current IDs are like "ben-bukhari". English counterpart is "eng-bukhari"
    const apiId = language === "bn" ? randomBook.id : randomBook.id.replace("ben-", "eng-")
    
    try {
      const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${apiId}.json`)
      if (!res.ok) throw new Error("API call failed")
      
      const data = await res.json()
      const randomHadith = data.hadiths[Math.floor(Math.random() * data.hadiths.length)]
      
      const payload = {
        hadith: randomHadith,
        book: randomBook.name,
        lastUpdated: today
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
      }

      return payload
    } catch (err) {
      throw new Error("Failed to fetch daily hadith")
    }
  }
)

const hadithSlice = createSlice({
  name: "hadith",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyHadith.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDailyHadith.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.dailyHadith = action.payload
        }
      })
      .addCase(fetchDailyHadith.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch hadith"
      })
  },
})

export const { setLoading } = hadithSlice.actions
export default hadithSlice.reducer
