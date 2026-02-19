import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")
    
    const { db } = await connectToDatabase()
    
    // Get records for the last X days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateString = startDate.toISOString().split("T")[0]

    const history = await db.collection("prayer_tracking")
      .find({ date: { $gte: startDateString } })
      .sort({ date: -1 })
      .toArray()
    
    return NextResponse.json(history)
  } catch (error) {
    console.error("Failed to fetch history:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
