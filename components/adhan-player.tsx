import React, { useEffect, useRef, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"
import { Volume2, Bell, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { setAudioEnabled } from "@/store/settingsSlice"

export function AdhanPlayer() {
  const dispatch = useAppDispatch()
  const { timings } = useAppSelector((state) => state.prayer)
  const { azanAlert, audioEnabled } = useAppSelector((state) => state.settings)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastPlayedRef = useRef<string | null>(null)
  const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null)
  const wakeLockRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen')
        console.log('Wake Lock active')
      } catch (err: any) {
        console.error("Wake Lock error:", err)
      }
    }
  }

  useEffect(() => {
    if (audioEnabled && azanAlert) {
      requestWakeLock()
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
        wakeLockRef.current = null
      }
    }
  }, [audioEnabled, azanAlert])

  useEffect(() => {
    // Initial audio setup
    audioRef.current = new Audio("https://www.islamcan.com/common/adhan/adhan1.mp3")
    audioRef.current.onended = () => setIsPlaying(false)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!azanAlert || !timings) return

    const interval = setInterval(() => {
      const now = new Date()
      // Manually format to HH:mm for reliability across browsers/locales
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const timeStr = `${hours}:${minutes}`
      
      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
      
      prayers.forEach(prayer => {
        const rawTime = timings[prayer as keyof typeof timings]
        if (!rawTime) return
        
        // Split to handle "05:07 (BST)" formats
        const prayerTime = rawTime.split(' ')[0]
        
        if (prayerTime === timeStr && lastPlayedRef.current !== `${prayer}-${timeStr}`) {
          playAdhan(prayer)
          lastPlayedRef.current = `${prayer}-${timeStr}`
        }
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [azanAlert, timings])

  useEffect(() => {
    if (isPlaying && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Adhan (আজান)',
        artist: 'Salat Time',
        album: 'Prayer Alert',
        artwork: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ]
      })

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play()
        setIsPlaying(true)
        navigator.mediaSession.playbackState = 'playing'
      })

      navigator.mediaSession.setActionHandler('pause', () => {
        stopAdhan()
      })

      navigator.mediaSession.setActionHandler('stop', () => {
        stopAdhan()
      })
    }
  }, [isPlaying])

  const playAdhan = (prayerName: string) => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          dispatch(setAudioEnabled(true))
          if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing'
          }
          
          toast.success(`Playing Azan for ${prayerName}`, {
            icon: <Bell className="h-4 w-4 text-primary" />,
            duration: 10000
          })

          // Show local notification with stop button
          if ('serviceWorker' in navigator && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(reg => {
              reg.showNotification(`Adhan: ${prayerName}`, {
                body: 'আজান বাজছে। বন্ধ করতে নিচের বাটনে ক্লিক করুন।',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                tag: 'adhan-playing',
                requireInteraction: true,
                actions: [
                  { action: 'stop', title: 'Stop Adhan (আজান বন্ধ করুন)' }
                ]
              } as any)
            })
          }

          // Auto-stop after 5 minutes
          if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current)
          autoStopTimerRef.current = setTimeout(() => {
            stopAdhan()
          }, 5 * 60 * 1000)
        })
        .catch((err: any) => {
          console.error("Adhan play failed:", err)
          dispatch(setAudioEnabled(false))
          toast("Adhan Time", {
            description: `It's time for ${prayerName}. Click to play Adhan.`,
            action: {
              label: "Play",
              onClick: () => enableAudio()
            }
          })
        })
    }
  }

  const stopAdhan = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none'
      }
      
      // Close local notification
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.getNotifications({ tag: 'adhan-playing' }).then(notifications => {
            notifications.forEach(n => n.close())
          })
        })
      }

      if (autoStopTimerRef.current) {
        clearTimeout(autoStopTimerRef.current)
        autoStopTimerRef.current = null
      }
    }
  }

  const enableAudio = () => {
    dispatch(setAudioEnabled(true))
    toast.info("Audio enabled for Adhan alerts")
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause()
        if (audioRef.current) audioRef.current.currentTime = 0
      }).catch(() => {})
    }
  }

  // Handle messages from Service Worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PLAY_ADHAN') {
        playAdhan('Prayer')
        dispatch(setAudioEnabled(true))
      } else if (event.data && event.data.type === 'STOP_ADHAN') {
        stopAdhan()
      }
    }
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage)
    }
    window.addEventListener('message', handleMessage)
    
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage)
      }
      window.removeEventListener('message', handleMessage)
      if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current)
    }
  }, [])

  if (isPlaying) {
    return (
      <div className="fixed bottom-24 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-zinc-950 border border-primary/30 rounded-full p-2 flex items-center gap-3 shadow-2xl shadow-primary/20 backdrop-blur-xl">
          <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
            <Volume2 className="h-5 w-5" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Playing Adhan</p>
            <p className="text-xs text-zinc-300 font-medium">Auto-Adhan Active</p>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-10 w-10 rounded-full bg-zinc-900 border border-white/5"
            onClick={stopAdhan}
          >
            <Square className="h-4 w-4 fill-current text-primary" />
          </Button>
        </div>
      </div>
    )
  }

  if (!audioEnabled && azanAlert) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-950 border border-primary/20 rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl shadow-primary/10"
        >
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <Volume2 size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Enable Adhan Alerts</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            ব্রাউজার পলিসির কারণে আজান শোনার জন্য একবার অডিও পারমিশন দিতে হয়। এছাড়া সময়মতো অ্যালার্ট পেতে নোটিফিকেশন চালু করুন।
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={enableAudio}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-12 font-bold gap-2 text-base shadow-lg shadow-primary/20"
            >
              আজান ও অডিও চালু করুন
            </Button>
            {mounted && typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
              <Button 
                variant="ghost"
                onClick={async () => {
                  const permission = await Notification.requestPermission()
                  if (permission === 'granted') {
                    toast.success("Notification enabled!")
                  } else {
                    toast.error("Notification permission denied")
                  }
                }}
                className="text-primary hover:bg-primary/5 rounded-2xl h-10 text-xs font-bold"
              >
                নোটিফিকেশন পারমিশন দিন
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}
