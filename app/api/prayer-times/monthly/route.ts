import { NextResponse } from "next/server"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"

async function fetchMonthlyFromAladhan(
  latitude: string,
  longitude: string,
  method: string,
  month: string,
  year: string,
  school: string = "1"
) {
  const url = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}&month=${month}&year=${year}`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch monthly calendar from Aladhan API")
  const apiData = await res.json()
  return apiData.data
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const method = searchParams.get("method") || "2"
  const school = searchParams.get("school") || "1"
  const now = new Date()
  const month = searchParams.get("month") || (now.getMonth() + 1).toString()
  const year = searchParams.get("year") || now.getFullYear().toString()

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    )
  }

  const canUseMongo = isMongoConfigured()

  if (!canUseMongo) {
    try {
      const data = await fetchMonthlyFromAladhan(latitude, longitude, method, month, year, school)
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      })
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch monthly prayer times" },
        { status: 500 }
      )
    }
  }

  try {
    const { db } = await connectToDatabase()
    const cacheKey = `monthly_${latitude}_${longitude}_${method}_${school}_${month}_${year}`

    const cached = await db
      .collection("prayer_times_cache")
      .findOne({ cacheKey })
    
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      })
    }

    const responseData = await fetchMonthlyFromAladhan(latitude, longitude, method, month, year, school)

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
          month: parseInt(month),
          year: parseInt(year),
          createdAt: new Date(),
        },
      },
      { upsert: true }
    ).catch(console.error)

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch (err) {
    console.error("Monthly prayer times API error", err)
    // Fallback
    try {
      const data = await fetchMonthlyFromAladhan(latitude, longitude, method, month, year, school)
      return NextResponse.json(data)
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch monthly prayer times" },
        { status: 500 }
      )
    }
  }
}
