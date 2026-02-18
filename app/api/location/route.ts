import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { latitude, longitude, city, userId } = body

    const { db } = await connectToDatabase()
    await db.collection("user_locations").updateOne(
      { userId: userId || "anonymous" },
      {
        $set: {
          latitude,
          longitude,
          city,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to save location" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    )
  }

  try {
    const { db } = await connectToDatabase()
    const location = await db
      .collection("user_locations")
      .findOne({ userId })

    if (!location) {
      return NextResponse.json({ latitude: null, longitude: null, city: null })
    }

    return NextResponse.json({
      latitude: location.latitude,
      longitude: location.longitude,
      city: location.city,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    )
  }
}
