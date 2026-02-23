"use client"

import { useEffect, useCallback, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setNotificationPermission } from "@/store/settingsSlice"
import { PRAYER_NAMES, getTimeDiff } from "@/lib/prayer-utils"
import { Bell, BellOff, BellRing, CheckCircle2, XCircle, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"

export function NotificationManager() {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.settings)
  const timings = useAppSelector((state) => state.prayer.timings)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { t } = useTranslation()
  const notifiedRef = useRef<Set<string>>(new Set())

  const subscribeToPush = async () => {
    if (!("serviceWorker" in navigator)) return
    setIsSubscribing(true)

    try {
      const registration = await navigator.serviceWorker.ready
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription,
          userId: "user_" + Math.random().toString(36).substr(2, 9), // Fallback ID
          location: "auto"
        })
      })

      if (response.ok) {
        setIsSubscribed(true)
        toast.success(t.notifications.toast_enabled)
      } else {
        throw new Error("Failed to save subscription")
      }
    } catch (err) {
      console.error("Push subscription error:", err)
      toast.error(t.notifications.toast_failed)
    } finally {
      setIsSubscribing(false)
    }
  }

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return
    const permission = await Notification.requestPermission()
    dispatch(setNotificationPermission(permission))
    if (permission === "granted") {
      subscribeToPush()
    }
  }, [dispatch])

  useEffect(() => {
    if ("Notification" in window) {
      dispatch(setNotificationPermission(Notification.permission))
      
      // Check if already subscribed
      if (Notification.permission === "granted" && "serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.pushManager.getSubscription().then(sub => {
            setIsSubscribed(!!sub)
          })
        })
      }
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
            const prayerName = t.prayers[name.toLowerCase() as keyof typeof t.prayers]
            new Notification(t.notifications.azan_title.replace("{prayer}", prayerName), {
              body: t.notifications.azan_body.replace("{prayer}", prayerName),
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
              new Notification(t.notifications.sehri_title, {
                body: t.notifications.sehri_body,
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
              new Notification(t.notifications.iftar_title, {
                body: t.notifications.iftar_body,
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
          {t.notifications.permission_status}
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
                <p className="text-sm font-medium text-foreground">{t.notifications.enabled}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t.notifications.enabled_desc}
                </p>
              </div>
            </>
          ) : permissionDenied ? (
            <>
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{t.notifications.blocked}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t.notifications.blocked_desc}
                </p>
              </div>
            </>
          ) : (
            <>
              <BellOff className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t.notifications.not_enabled}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t.notifications.not_enabled_desc}
                </p>
              </div>
              <Button
                onClick={requestPermission}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-xl"
              >
                {t.common.enable}
              </Button>
            </>
          )}
        </div>

        {/* Background Alert Section */}
        {permissionGranted && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  {t.notifications.background_alerts}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {t.notifications.background_desc}
                </p>
              </div>
              <Button
                size="sm"
                variant={isSubscribed ? "outline" : "default"}
                disabled={isSubscribing || isSubscribed}
                onClick={subscribeToPush}
                className={cn(
                  "rounded-xl font-bold h-9 px-4 transition-all",
                  isSubscribed && "bg-accent/10 text-accent border-accent/20 hover:bg-accent/15"
                )}
              >
                {isSubscribing ? t.common.setting_up : isSubscribed ? t.common.active : t.common.enable}
              </Button>
            </div>
            {isSubscribed && (
              <div className="bg-accent/5 rounded-xl p-3 border border-accent/10 flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t.notifications.background_active_desc}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Active Alerts */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {t.notifications.active_alerts}
        </h2>
        <div className="flex flex-col gap-2.5">
          <AlertRow
            label={t.notifications.azan_label}
            desc={t.notifications.azan_desc}
            enabled={settings.azanAlert}
          />
          <AlertRow
            label={t.notifications.sehri_label}
            desc={t.notifications.sehri_desc}
            enabled={settings.sehriAlert}
          />
          <AlertRow
            label={t.notifications.iftar_label}
            desc={t.notifications.iftar_desc}
            enabled={settings.iftarAlert}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-4">
          {t.notifications.configure_settings}
        </p>
      </section>

      {/* How it works */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
          {t.notifications.how_it_works}
        </h2>
        <div className="flex flex-col gap-3">
          {[
            t.notifications.step_1,
            t.notifications.step_2,
            t.notifications.step_3,
            t.notifications.step_4,
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
  const { t } = useTranslation()
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
        {enabled ? t.common.on : t.common.off}
      </span>
    </div>
  )
}
