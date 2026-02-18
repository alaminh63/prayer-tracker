import { NextResponse } from "next/server"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"
import type { PrayerTimesResponse } from "@/lib/prayer-utils"

async function fetchFromAladhan(
  latitude: string,
  longitude: string,
  method: string,
  school: string = "1"
) {
  const res = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`
  )
  if (!res.ok) throw new Error("Failed to fetch from Aladhan API")
  const apiData: PrayerTimesResponse = await res.json()
  const { timings, date } = apiData.data

  return {
    timings: {
      Fajr: timings.Fajr,
      Sunrise: timings.Sunrise,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
    },
    hijriDate: date.hijri.day,
    hijriMonth: date.hijri.month.en,
    hijriYear: date.hijri.year,
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
      const data = await fetchFromAladhan(latitude, longitude, method, school)
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
    const cacheKey = `${latitude}_${longitude}_${method}_${school}_${today}`

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
    const responseData = await fetchFromAladhan(latitude, longitude, method, school)

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
      const data = await fetchFromAladhan(latitude, longitude, method, school)
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
