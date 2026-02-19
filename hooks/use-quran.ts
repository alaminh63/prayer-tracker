import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[]
}

export const useSurahs = () => {
  const { data, error, isLoading } = useSWR(
    "https://api.alquran.cloud/v1/surah",
    fetcher
  )

  return {
    surahs: data?.data as Surah[] || [],
    isLoading,
    isError: error,
  }
}

export const useSurah = (surahNumber: number, edition: string = "quran-uthmani") => {
  const { data, error, isLoading } = useSWR(
    `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${edition},bn.bengali`,
    fetcher
  )

  // data.data will be an array of two editions
  const arabicSurah = data?.data?.[0] as SurahDetail
  const bengaliSurah = data?.data?.[1] as SurahDetail

  return {
    arabicSurah,
    bengaliSurah,
    isLoading,
    isError: error,
  }
}
