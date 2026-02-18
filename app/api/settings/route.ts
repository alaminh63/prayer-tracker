import { NextResponse } from "next/server"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"

const DEFAULT_SETTINGS = {
  azanAlert: true,
  sehriAlert: true,
  iftarAlert: true,
  autoLocation: true,
  calculationMethod: 2,
  asrMethod: 1,
  hijriOffset: 0,
  language: "bn",
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

  if (!isMongoConfigured()) {
    return NextResponse.json(DEFAULT_SETTINGS)
  }

  try {
    const { db } = await connectToDatabase()
    const settings = await db
      .collection("user_settings")
      .findOne({ userId })

    if (!settings) {
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    return NextResponse.json(settings)
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, ...settings } = body

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, message: "Saved locally" })
    }

    try {
      const { db } = await connectToDatabase()
      await db.collection("user_settings").updateOne(
        { userId },
        {
          $set: {
            ...settings,
            userId,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      )
      return NextResponse.json({ success: true })
    } catch (err) {
      console.error("Database error saving settings:", err)
      // Fallback: return success since it's saved in localStorage anyway
      return NextResponse.json({ success: true, message: "Saved locally due to DB error" })
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}
