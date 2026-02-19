"use client"

import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveAudioAyah, setIsPlaying } from "@/store/quranSlice"
import { Play, Pause, SkipForward, SkipBack, X, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export const GlobalAudioPlayer = () => {
  const dispatch = useAppDispatch()
  const { activeAudioAyah, isPlaying, reciter, isLooping } = useAppSelector((state) => state.quran)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (activeAudioAyah) {
      const fetchAudio = async () => {
        try {
          const res = await fetch(
            `https://api.alquran.cloud/v1/ayah/${activeAudioAyah.surahNumber}:${activeAudioAyah.ayahNumber}/${reciter}`
          )
          const data = await res.json()
          if (data.data?.audio) {
            setAudioUrl(data.data.audio)
          }
        } catch (error) {
          console.error("Failed to fetch audio:", error)
        }
      }
      fetchAudio()
    }
  }, [activeAudioAyah, reciter])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, audioUrl])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.error("Loop playback failed:", e))
      return
    }

    // Auto play next ayah logic
    if (activeAudioAyah) {
      const nextAyah = activeAudioAyah.ayahNumber + 1
      if (activeAudioAyah.totalAyahs && nextAyah > activeAudioAyah.totalAyahs) {
        dispatch(setIsPlaying(false))
      } else {
        dispatch(setActiveAudioAyah({
          ...activeAudioAyah,
          ayahNumber: nextAyah
        }))
      }
    }
  }

  const handlePrev = () => {
    if (activeAudioAyah && activeAudioAyah.ayahNumber > 1) {
      dispatch(setActiveAudioAyah({
        ...activeAudioAyah,
        ayahNumber: activeAudioAyah.ayahNumber - 1
      }))
    }
  }

  const handleNext = () => {
    if (activeAudioAyah) {
      const nextAyah = activeAudioAyah.ayahNumber + 1
      if (activeAudioAyah.totalAyahs && nextAyah > activeAudioAyah.totalAyahs) {
        // Option: Move to next surah? For now just stop.
        dispatch(setIsPlaying(false))
      } else {
        dispatch(setActiveAudioAyah({
          ...activeAudioAyah,
          ayahNumber: nextAyah
        }))
      }
    }
  }

  const togglePlay = () => {
    dispatch(setIsPlaying(!isPlaying))
  }

  const closePlayer = () => {
    dispatch(setActiveAudioAyah(null))
    dispatch(setIsPlaying(false))
  }

  if (!activeAudioAyah) return null

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-80 lg:right-8 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
        <audio
          ref={audioRef}
          src={audioUrl || ""}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              {activeAudioAyah.ayahNumber}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight">Playing Ayah {activeAudioAyah.ayahNumber}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Surah {activeAudioAyah.surahNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handlePrev} disabled={activeAudioAyah.ayahNumber === 1}>
              <SkipBack className="h-4 w-4 fill-current" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-primary/20 text-primary hover:bg-primary/30" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleNext}>
              <SkipForward className="h-4 w-4 fill-current" />
            </Button>
            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={closePlayer}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-1">
          <div className="h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
