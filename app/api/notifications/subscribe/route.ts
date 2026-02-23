import { NextResponse } from "next/server"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscription, userId, location } = body

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription is required" },
        { status: 400 }
      )
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const { db } = await connectToDatabase()

    // Save or update subscription
    await db.collection("push_subscriptions").updateOne(
      { "subscription.endpoint": subscription.endpoint },
      {
        $set: {
          subscription,
          userId: userId || "anonymous",
          location: location || null,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, message: "Subscription saved" })
  } catch (err) {
    console.error("Subscription error:", err)
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    )
  }
}
