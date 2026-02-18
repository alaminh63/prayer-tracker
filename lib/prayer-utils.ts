export interface PrayerTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

export interface PrayerTimesResponse {
  code: number
  data: {
    timings: PrayerTimes & Record<string, string>
    date: {
      readable: string
      hijri: {
        date: string
        month: { number: number; en: string; ar: string }
        year: string
        day: string
      }
      gregorian: {
        date: string
        month: { number: number; en: string }
        year: string
        day: string
      }
    }
  }
}

export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const
export type PrayerName = (typeof PRAYER_NAMES)[number]

export const PRAYER_LABELS: Record<PrayerName, string> = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
}

export const PRAYER_ARABIC: Record<PrayerName, string> = {
  Fajr: "\u0641\u062C\u0631",
  Dhuhr: "\u0638\u0647\u0631",
  Asr: "\u0639\u0635\u0631",
  Maghrib: "\u0645\u063A\u0631\u0628",
  Isha: "\u0639\u0634\u0627\u0621",
}

export function parseTimeString(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number)
  const now = new Date()
  now.setHours(hours, minutes, 0, 0)
  return now
}

export function getTimeDiff(targetTime: string): number {
  const now = new Date()
  const target = parseTimeString(targetTime)
  return target.getTime() - now.getTime()
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00"
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function getCurrentAndNextPrayer(
  timings: PrayerTimes
): { current: PrayerName | null; next: PrayerName; timeLeft: number } {
  const now = new Date()

  for (let i = 0; i < PRAYER_NAMES.length; i++) {
    const prayerTime = parseTimeString(timings[PRAYER_NAMES[i]])
    if (now < prayerTime) {
      return {
        current: i > 0 ? PRAYER_NAMES[i - 1] : null,
        next: PRAYER_NAMES[i],
        timeLeft: prayerTime.getTime() - now.getTime(),
      }
    }
  }

  // After Isha, next prayer is tomorrow's Fajr
  const tomorrowFajr = parseTimeString(timings.Fajr)
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1)
  return {
    current: "Isha",
    next: "Fajr",
    timeLeft: tomorrowFajr.getTime() - now.getTime(),
  }
}
