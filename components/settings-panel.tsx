    "use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  toggleAzanAlert,
  toggleSehriAlert,
  toggleIftarAlert,
  toggleAutoLocation,
  setCalculationMethod,
  setAsrMethod,
  setHijriOffset,
  setLanguage,
  setNotificationPermission,
} from "@/store/settingsSlice"
import { fetchLocation } from "@/store/locationSlice"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Moon, Sun, MapPin, Calculator, Info } from "lucide-react"
import { useTheme } from "next-themes"

const calculationMethods = [
  { value: "1", label: "University of Islamic Sciences, Karachi" },
  { value: "2", label: "Islamic Society of North America (ISNA)" },
  { value: "3", label: "Muslim World League" },
  { value: "4", label: "Umm Al-Qura University, Makkah" },
  { value: "5", label: "Egyptian General Authority of Survey" },
  { value: "7", label: "Institute of Geophysics, University of Tehran" },
  { value: "8", label: "Gulf Region" },
  { value: "9", label: "Kuwait" },
  { value: "10", label: "Qatar" },
  { value: "11", label: "Majlis Ugama Islam Singapura" },
  { value: "14", label: "Bangladesh Islamic Foundation" },
]

function SettingRow({
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  label,
  htmlFor,
  checked,
  onToggle,
}: {
  icon: React.ElementType
  iconColor?: string
  iconBg?: string
  label: string
  htmlFor: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} border border-border/50`}>
          <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
        </div>
        <Label htmlFor={htmlFor} className="text-sm text-foreground cursor-pointer">
          {label}
        </Label>
      </div>
      <Switch id={htmlFor} checked={checked} onCheckedChange={onToggle} />
    </div>
  )
}

export function SettingsPanel() {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.settings)
  const location = useAppSelector((state) => state.location)
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Language Settings */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {t.settings.language}
        </h2>
        <div className="space-y-3">
          <Select
            value={settings.language}
            onValueChange={(value) =>
              dispatch(setLanguage(value as "en" | "bn"))
            }
          >
            <SelectTrigger className="bg-secondary/50 border-border text-foreground">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
          <Bell className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {t.settings.notifications}
        </h2>
        
        <div className="mb-6 space-y-3">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Notification Permission</span>
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                settings.notificationPermission === 'granted' ? "bg-emerald-500/20 text-emerald-500" : "bg-primary/20 text-primary"
              )}>
                {settings.notificationPermission}
              </span>
            </div>
            {settings.notificationPermission !== 'granted' && (
              <Button 
                size="sm" 
                className="w-full mt-2 h-8 text-[10px] font-bold"
                onClick={async () => {
                  const permission = await Notification.requestPermission()
                  dispatch(setNotificationPermission(permission))
                  if (permission === 'granted') toast.success("Notification enabled!")
                }}
              >
                Enable Notifications
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full h-8 text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => {
                window.postMessage({ type: 'PLAY_ADHAN' }, '*')
                toast.success("Adhan test started")
              }}
            >
              Test Adhan Sound
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-8 text-[10px] font-bold border-primary/20 text-primary/70 hover:bg-primary/5"
              onClick={() => {
                if ('serviceWorker' in navigator && Notification.permission === 'granted') {
                  navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification('Salat Time Test', {
                      body: 'এটি একটি টেস্ট নোটিফিকেশন। অ্যাপ বন্ধ থাকলেও আজান এলার্ট কাজ করবে।',
                      icon: '/icons/icon-192x192.png',
                      badge: '/icons/icon-192x192.png',
                      tag: 'test',
                      data: { url: '/' },
                      actions: [
                        { action: 'play', title: 'Play Adhan' },
                        { action: 'close', title: 'Close' }
                      ]
                    } as any)
                  })
                } else {
                  toast.error("Please enable notifications first")
                }
              }}
            >
              Test Notification
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SettingRow
            icon={Bell}
            label={t.settings.azan_alert}
            htmlFor="azan-alert"
            checked={settings.azanAlert}
            onToggle={() => dispatch(toggleAzanAlert())}
          />
          <SettingRow
            icon={Moon}
            label={t.settings.sehri_alert}
            htmlFor="sehri-alert"
            checked={settings.sehriAlert}
            onToggle={() => dispatch(toggleSehriAlert())}
          />
          <SettingRow
            icon={Sun}
            iconColor="text-accent"
            iconBg="bg-accent/10"
            label={t.settings.iftar_alert}
            htmlFor="iftar-alert"
            checked={settings.iftarAlert}
            onToggle={() => dispatch(toggleIftarAlert())}
          />
        </div>
      </section>

      {/* Location Settings */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {t.settings.location}
        </h2>
        <div className="flex flex-col gap-4">
          <SettingRow
            icon={MapPin}
            label={t.settings.auto_location}
            htmlFor="auto-location"
            checked={settings.autoLocation}
            onToggle={() => {
              dispatch(toggleAutoLocation())
              if (!settings.autoLocation) {
                dispatch(fetchLocation())
              }
            }}
          />
          {location.latitude && location.longitude && (
            <div className="rounded-xl bg-secondary/50 border border-border p-3.5 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-4">
                <span>Lat: {location.latitude.toFixed(4)}</span>
                <span>Lng: {location.longitude.toFixed(4)}</span>
              </div>
              {location.city && (
                <p className="mt-1.5 text-foreground font-sans font-medium">{location.city}</p>
              )}
            </div>
          )}
        </div>
      </section>


      {/* Appearance Settings */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
          <Sun className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {t.settings.theme}
        </h2>
        <div className="space-y-3">
          <Select
            value={theme}
            onValueChange={(value) =>
              setTheme(value)
            }
          >
            <SelectTrigger className="bg-secondary/50 border-border text-foreground">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t.settings.theme_light}</SelectItem>
              <SelectItem value="dark">{t.settings.theme_dark}</SelectItem>
              <SelectItem value="system">{t.settings.theme_system}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* App Info */}
      <section className="glass-card rounded-2xl p-5 text-center">
        <p className="text-sm font-black text-foreground">CloudGen</p>
        <p className="text-[11px] text-muted-foreground mt-1">{t.settings.version}</p>
        <p className="text-[11px] text-muted-foreground mt-2">
          {t.settings.built_by}
        </p>
      </section>
    </div>
  )
}
