"use client"

import { useEffect, useCallback, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setNotificationPermission } from "@/store/settingsSlice"
import { PRAYER_NAMES, PRAYER_LABELS, getTimeDiff } from "@/lib/prayer-utils"
import { Bell, BellOff, BellRing, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NotificationManager() {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.settings)
  const { timings } = useAppSelector((state) => state.prayer)
  const notifiedRef = useRef<Set<string>>(new Set())

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return
    const permission = await Notification.requestPermission()
    dispatch(setNotificationPermission(permission))
  }, [dispatch])

  useEffect(() => {
    if ("Notification" in window) {
      dispatch(setNotificationPermission(Notification.permission))
    }
  }, [dispatch])

  useEffect(() => {
    if (!timings || settings.notificationPermission !== "granted") return

    const checkNotifications = () => {
      const now = new Date()
      const todayKey = now.toDateString()

      PRAYER_NAMES.forEach((name) => {
        const key = `${todayKey}-${name}`
        if (notifiedRef.current.has(key)) return

        const diff = getTimeDiff(timings[name])

        if (diff >= -60000 && diff <= 60000) {
          if (settings.azanAlert) {
            new Notification(`${PRAYER_LABELS[name]} Time`, {
              body: `It is time for ${PRAYER_LABELS[name]} prayer.`,
              icon: "/icon.svg",
              tag: key,
            })
            notifiedRef.current.add(key)
          }
        }

        if (name === "Fajr" && settings.sehriAlert) {
          const sehriKey = `${todayKey}-sehri`
          if (!notifiedRef.current.has(sehriKey)) {
            if (diff >= 540000 && diff <= 660000) {
              new Notification("Sehri Ending Soon", {
                body: "Sehri will end in approximately 10 minutes.",
                icon: "/icon.svg",
                tag: sehriKey,
              })
              notifiedRef.current.add(sehriKey)
            }
          }
        }

        if (name === "Maghrib" && settings.iftarAlert) {
          const iftarKey = `${todayKey}-iftar`
          if (!notifiedRef.current.has(iftarKey)) {
            if (diff >= -60000 && diff <= 60000) {
              new Notification("Iftar Time!", {
                body: "It is time to break your fast. Alhamdulillah!",
                icon: "/icon.svg",
                tag: iftarKey,
              })
              notifiedRef.current.add(iftarKey)
            }
          }
        }
      })
    }

    const interval = setInterval(checkNotifications, 30000)
    checkNotifications()
    return () => clearInterval(interval)
  }, [timings, settings])

  const permissionGranted = settings.notificationPermission === "granted"
  const permissionDenied = settings.notificationPermission === "denied"

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Permission Status */}
      <section className="glass-card-strong rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
          <BellRing className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Permission Status
        </h2>

        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-4 border",
            permissionGranted
              ? "bg-accent/10 border-accent/20"
              : permissionDenied
                ? "bg-destructive/10 border-destructive/20"
                : "bg-secondary/50 border-border"
          )}
        >
          {permissionGranted ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Notifications Enabled</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  You will receive prayer time alerts
                </p>
              </div>
            </>
          ) : permissionDenied ? (
            <>
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Notifications Blocked</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Enable notifications in your browser settings
                </p>
              </div>
            </>
          ) : (
            <>
              <BellOff className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Not Enabled</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Enable to receive Azan and prayer alerts
                </p>
              </div>
              <Button
                onClick={requestPermission}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-xl"
              >
                Enable
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Active Alerts */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Active Alerts
        </h2>
        <div className="flex flex-col gap-2.5">
          <AlertRow
            label="Azan Alerts (5 Waqt)"
            desc="Get notified at each prayer time"
            enabled={settings.azanAlert}
          />
          <AlertRow
            label="Sehri End Alert"
            desc="10 minutes before Fajr starts"
            enabled={settings.sehriAlert}
          />
          <AlertRow
            label="Iftar Alert"
            desc="When Maghrib time arrives"
            enabled={settings.iftarAlert}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-4">
          Configure alert toggles in the Settings page.
        </p>
      </section>

      {/* How it works */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
          How It Works
        </h2>
        <div className="flex flex-col gap-3">
          {[
            "Your location is used to calculate accurate prayer times",
            "The app checks prayer times every 30 seconds",
            "Notifications are triggered when it is time for prayer",
            "Keep the browser tab open for best results",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 border border-primary/15 text-[11px] text-primary font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function AlertRow({
  label,
  desc,
  enabled,
}: {
  label: string
  desc: string
  enabled: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl p-3.5 border transition-all",
        enabled
          ? "bg-primary/5 border-primary/15"
          : "bg-secondary/30 border-border opacity-50"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          enabled ? "bg-primary/10" : "bg-muted/30"
        )}
      >
        {enabled ? (
          <Bell className="h-3.5 w-3.5 text-primary" />
        ) : (
          <BellOff className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", enabled ? "text-foreground" : "text-muted-foreground")}>
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">{desc}</p>
      </div>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0",
          enabled ? "bg-accent/15 text-accent" : "bg-muted/30 text-muted-foreground"
        )}
      >
        {enabled ? "On" : "Off"}
      </span>
    </div>
  )
}
