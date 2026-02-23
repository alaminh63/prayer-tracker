import { NextResponse } from "next/server"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"
import { sendPushNotification } from "@/lib/notifications"

// This would be triggered by a Cron service every minute
export async function GET(request: Request) {
  // Simple security check
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")
  
  // In production, use a strong secret
  if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "DB not configured" }, { status: 503 })
  }

  try {
    const { db } = await connectToDatabase()
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const currentTime = `${hours}:${minutes}`

    console.log(`[Cron] Checking notifications for ${currentTime}`)

    // Get all unique subscriptions
    const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
    
    let sentCount = 0

    // For each subscription, we should ideally calculate prayer times based on their location
    // For this implementation, we fetch the default prayer times or user-specific ones
    for (const sub of subscriptions) {
      // In a real app, you'd calculate for their specific lat/ln
      // Here we'll use a mock/default logic or fetch from a shared state
      
      // Let's assume we have a way to get prayer times for a city
      const prayerTimes = await getPrayerTimesForUser(sub)
      
      if (!prayerTimes) continue

      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
      
      for (const prayer of prayers) {
        let prayerTime = prayerTimes[prayer]
        if (prayerTime && prayerTime.includes(' ')) {
          prayerTime = prayerTime.split(' ')[0]
        }

        if (prayerTime === currentTime) {
          await sendPushNotification(sub.subscription, {
            title: `${prayer} Time`,
            body: `It is time for ${prayer} prayer. Alhamdulillah!`,
            url: "/prayers",
            playAdhan: true
          })
          sentCount++
        }
      }
    }

    return NextResponse.json({ success: true, processed: subscriptions.length, sent: sentCount })
  } catch (err) {
    console.error("Cron error:", err)
    return NextResponse.json({ error: "Interal error" }, { status: 500 })
  }
}

async function getPrayerTimesForUser(userSub: any) {
  // Implementation to fetch/calculate prayer times
  // For now, returning a mock or fetching from the main API if possible
  // Ideally, this should use the same logic as the frontend but on the server
  
  // Example: fetch from an external API or internal library
  // For simplicity in this demo, let's assume Dhaka times if no location
  const response = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=2`)
  const data = await response.json()
  return data.data.timings
}
