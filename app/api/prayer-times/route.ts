import { NextResponse } from "next/server"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"
import type { PrayerTimesResponse } from "@/lib/prayer-utils"

async function fetchFromAladhan(
  latitude: string,
  longitude: string,
  method: string,
  school: string = "1",
  adjustment: string = "0"
) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    method,
    school,
  })
  // Parse adjustment value once
  const adj = parseInt(adjustment)
  // Only include in Aladhan params if non-zero (for prayer time offset if API supports it)
  if (adj !== 0) params.set("adjustment", String(adj))

  const res = await fetch(
    `https://api.aladhan.com/v1/timings?${params.toString()}`
  )
  if (!res.ok) throw new Error("Failed to fetch from Aladhan API")
  const apiData: PrayerTimesResponse = await res.json()
  const { timings, date } = apiData.data

  // Apply adjustment to Hijri day, handling month rollover
  const rawDay = parseInt(date.hijri.day)
  const rawMonth = date.hijri.month.number
  const rawYear = parseInt(date.hijri.year)

  // Days in each Hijri month (alternating 30/29, last month has 30 in leap years)
  // Simplified: use 30 for odd months, 29 for even months
  const hijriDaysInMonth = (m: number) => (m % 2 === 1 ? 30 : 29)

  let adjDay = rawDay + adj
  let adjMonth = rawMonth
  let adjYear = rawYear

  if (adjDay < 1) {
    adjMonth -= 1
    if (adjMonth < 1) { adjMonth = 12; adjYear -= 1 }
    adjDay = hijriDaysInMonth(adjMonth) + adjDay
  } else if (adjDay > hijriDaysInMonth(adjMonth)) {
    adjDay = adjDay - hijriDaysInMonth(adjMonth)
    adjMonth += 1
    if (adjMonth > 12) { adjMonth = 1; adjYear += 1 }
  }

  return {
    timings: {
      Fajr: timings.Fajr,
      Sunrise: timings.Sunrise,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
    },
    hijriDate: String(adjDay),
    hijriMonth: date.hijri.month.en,
    hijriYear: String(adjYear),
    gregorianDate: date.readable,
  }
}

// Basic Circuit Breaker state (in-memory, so it resets on server restart)
let mongoIsDownUntil = 0
const CIRCUIT_BREAKER_COOLDOWN = 120000 // 2 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const method = searchParams.get("method") || "2"
  const school = searchParams.get("school") || "1"
  const adjustment = searchParams.get("adjustment") || "0"

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    )
  }

  const isCircuitOpen = Date.now() < mongoIsDownUntil
  const canUseMongo = isMongoConfigured() && !isCircuitOpen

  // If MongoDB is not configured or circuit is open, fetch directly from Aladhan
  if (!canUseMongo) {
    try {
      const data = await fetchFromAladhan(latitude, longitude, method, school, adjustment)
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      })
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch prayer times" },
        { status: 500 }
      )
    }
  }

  try {
    // Check MongoDB cache first
    const { db } = await connectToDatabase()
    const today = new Date().toISOString().split("T")[0]
    const cacheKey = `${latitude}_${longitude}_${method}_${school}_${adjustment}_${today}`

    const cached = await db
      .collection("prayer_times_cache")
      .findOne({ cacheKey })
    
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      })
    }

    // Fetch from Aladhan API
    const responseData = await fetchFromAladhan(latitude, longitude, method, school, adjustment)

    // Cache to MongoDB
    // We don't await this to speed up the response if caching is slow
    db.collection("prayer_times_cache").updateOne(
      { cacheKey },
      {
        $set: {
          cacheKey,
          data: responseData,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          method: parseInt(method),
          school: parseInt(school),
          createdAt: new Date(),
        },
      },
      { upsert: true }
    ).catch(console.error)

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (err) {
    // MongoDB failure - open the circuit breaker
    console.error("MongoDB connection failed, opening circuit breaker", err)
    mongoIsDownUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN

    // Fallback: fetch directly from Aladhan
    try {
      const data = await fetchFromAladhan(latitude, longitude, method, school, adjustment)
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      })
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch prayer times" },
        { status: 500 }
      )
    }
  }
}
