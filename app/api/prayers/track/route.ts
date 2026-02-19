import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    
    const { db } = await connectToDatabase()
    
    const record = await db.collection("prayer_tracking").findOne({ date })
    
    if (record) {
      // Migration: fallback for old structure
      if (record.prayers && !record.salat) {
        record.salat = record.prayers
      }
      return NextResponse.json({
        date: record.date,
        salat: record.salat || {},
        morning: record.morning || {},
        evening: record.evening || {},
        night: record.night || {},
      })
    }
    
    return NextResponse.json({ date, salat: {}, morning: {}, evening: {}, night: {} })
  } catch (error) {
    console.error("Failed to fetch tracking data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, id, category = "salat", status } = body
    
    if (!date || !id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    // Category mapping ensures we update the right object in the document
    const updatePath = `${category}.${id}`
    
    await db.collection("prayer_tracking").updateOne(
      { date },
      { $set: { [updatePath]: status } },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update tracking data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
