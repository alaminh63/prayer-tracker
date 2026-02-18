import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    
    const { db } = await connectToDatabase()
    
    const record = await db.collection("prayer_tracking").findOne({ date })
    
    return NextResponse.json(record || { date, prayers: {} })
  } catch (error) {
    console.error("Failed to fetch prayer tracking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, prayerId, status } = body
    
    if (!date || !prayerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const updatePath = `prayers.${prayerId}`
    
    await db.collection("prayer_tracking").updateOne(
      { date },
      { $set: { [updatePath]: status } },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update prayer tracking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
