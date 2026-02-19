import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface CalendarDay {
  date: {
    readable: string
    timestamp: string
    gregorian: {
      date: string
      day: string
      weekday: { en: string }
      month: { number: number; en: string }
      year: string
    }
    hijri: {
      date: string
      day: string
      weekday: { en: string; ar: string }
      month: { number: number; en: string; ar: string }
      year: string
      holidays: string[]
    }
  }
}

export const useCalendar = (year: number, month: number, latitude: number | null, longitude: number | null, method: number = 2) => {
  const shouldFetch = latitude !== null && longitude !== null
  
  const { data, error, isLoading } = useSWR(
    shouldFetch 
      ? `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`
      : null,
    fetcher
  )

  return {
    days: data?.data as CalendarDay[] || [],
    isLoading,
    isError: error,
  }
}

export const useYearlyCalendar = (year: number, latitude: number | null, longitude: number | null, method: number = 2) => {
  const shouldFetch = latitude !== null && longitude !== null
  
  const { data, error, isLoading } = useSWR(
    shouldFetch 
      ? `https://api.aladhan.com/v1/calendar/${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`
      : null,
    fetcher
  )

  return {
    calendar: data?.data as Record<string, CalendarDay[]> || null,
    isLoading,
    isError: error,
  }
}
