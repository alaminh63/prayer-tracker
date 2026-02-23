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

/** Applies a day offset to a CalendarDay's hijri.day value (handles month rollover simply) */
function applyHijriAdjustment(days: CalendarDay[], adjustment: number): CalendarDay[] {
  if (adjustment === 0) return days
  return days.map((day) => {
    const rawDay = parseInt(day.date.hijri.day)
    const adjDay = Math.max(1, Math.min(30, rawDay + adjustment))
    return {
      ...day,
      date: {
        ...day.date,
        hijri: {
          ...day.date.hijri,
          day: String(adjDay),
        },
      },
    }
  })
}

export const useCalendar = (
  year: number,
  month: number,
  latitude: number | null,
  longitude: number | null,
  method: number = 2,
  adjustment: number = 0
) => {
  const shouldFetch = latitude !== null && longitude !== null

  const urlParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    method: String(method),
  })

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `https://api.aladhan.com/v1/calendar/${year}/${month}?${urlParams.toString()}`
      : null,
    fetcher
  )

  const rawDays: CalendarDay[] = data?.data || []

  return {
    days: applyHijriAdjustment(rawDays, adjustment),
    isLoading,
    isError: error,
  }
}

export const useYearlyCalendar = (
  year: number,
  latitude: number | null,
  longitude: number | null,
  method: number = 2,
  adjustment: number = 0
) => {
  const shouldFetch = latitude !== null && longitude !== null

  const urlParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    method: String(method),
  })

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `https://api.aladhan.com/v1/calendar/${year}?${urlParams.toString()}`
      : null,
    fetcher
  )

  const rawCalendar: Record<string, CalendarDay[]> | null = data?.data || null

  // Apply adjustment to each day in each month
  const adjustedCalendar = rawCalendar
    ? Object.fromEntries(
        Object.entries(rawCalendar).map(([monthKey, monthDays]) => [
          monthKey,
          applyHijriAdjustment(monthDays, adjustment),
        ])
      )
    : null

  return {
    calendar: adjustedCalendar,
    isLoading,
    isError: error,
  }
}

export const useHijriCalendar = (
  hijriYear: number,
  hijriMonth: number,
  latitude: number | null,
  longitude: number | null,
  method: number = 2
) => {
  const shouldFetch = latitude !== null && longitude !== null

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `https://api.aladhan.com/v1/hijriCalendar/${hijriYear}/${hijriMonth}?latitude=${latitude}&longitude=${longitude}&method=${method}`
      : null,
    fetcher
  )

  return {
    days: data?.data as any[] || [],
    isLoading,
    isError: error,
  }
}
