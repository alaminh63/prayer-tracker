import webpush from "web-push"
import { env } from "@/lib/env"

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  env.VAPID_EMAIL,
  env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
)

export async function sendPushNotification(
  subscription: any,
  payload: { title: string; body: string; url?: string; playAdhan?: boolean }
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    )
    return { success: true }
  } catch (err: any) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      // Subscription expired or no longer valid
      return { success: false, error: "expired", message: err.message }
    }
    console.error("Push notification error:", err)
    return { success: false, error: "error", message: err.message }
  }
}
