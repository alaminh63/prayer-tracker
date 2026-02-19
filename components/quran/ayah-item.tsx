"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setLastRead, toggleBookmark, setActiveAudioAyah, setIsPlaying, toggleLooping } from "@/store/quranSlice"
import { Bookmark, BookmarkCheck, Play, Share2, History, Pause, Repeat, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareCard } from "./share-card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AyahItemProps {
  numberInSurah: number
  arabicText: string
  translationText: string
  surahNumber: number
  surahName: string
  totalAyahs?: number
}

export const AyahItem = ({
  numberInSurah,
  arabicText,
  translationText,
  surahNumber,
  surahName,
  totalAyahs,
}: AyahItemProps) => {
  const dispatch = useAppDispatch()
  const { arabicFontSize, translationFontSize, bookmarks, activeAudioAyah, isPlaying, isLooping } = useAppSelector((state) => state.quran)
  
  const isBookmarked = bookmarks.find(
    (b) => b.surahNumber === surahNumber && b.ayahNumber === numberInSurah
  )

  const isActive = activeAudioAyah?.surahNumber === surahNumber && activeAudioAyah?.ayahNumber === numberInSurah

  const handlePlay = () => {
    if (isActive) {
      dispatch(setIsPlaying(!isPlaying))
    } else {
      dispatch(setActiveAudioAyah({ 
        surahNumber, 
        ayahNumber: numberInSurah,
        totalAyahs 
      }))
    }
  }

  const handleLoop = () => {
    if (!isActive) {
      dispatch(setActiveAudioAyah({ 
        surahNumber, 
        ayahNumber: numberInSurah,
        totalAyahs 
      }))
    }
    dispatch(toggleLooping())
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/quran/${surahNumber}#ayah-${numberInSurah}`
    navigator.clipboard.writeText(url)
    toast.success("Ayah link copied to clipboard")
  }

  const handleLastRead = () => {
    dispatch(setLastRead({ surahNumber, ayahNumber: numberInSurah, surahName }))
    toast.success(`Marked Ayah ${numberInSurah} of ${surahName} as last read`)
  }

  const handleBookmark = () => {
    dispatch(toggleBookmark({ surahNumber, ayahNumber: numberInSurah }))
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks")
  }

  const handleShare = () => {
    const text = `${surahName} (${surahNumber}:${numberInSurah})\n\n${arabicText}\n\n${translationText}`
    if (navigator.share) {
      navigator.share({ title: `Ayah ${numberInSurah}`, text })
    } else {
      navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    }
  }

  const [showWords, setShowWords] = useState(false)
  const [words, setWords] = useState<any[]>([])
  const [loadingWords, setLoadingWords] = useState(false)

  const fetchWords = async () => {
    if (words.length > 0) return
    setLoadingWords(true)
    try {
      const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${numberInSurah}?words=true&word_fields=text_uthmani`)
      const data = await res.json()
      if (data.verse?.words) {
        setWords(data.verse.words)
      }
    } catch (err) {
      console.error("Failed to fetch words:", err)
      toast.error("Failed to load word-by-word data")
    } finally {
      setLoadingWords(false)
    }
  }

  const toggleWords = () => {
    if (!showWords) fetchWords()
    setShowWords(!showWords)
  }

  return (
    <div className={cn(
      "py-8 border-b border-border/40 group transition-all duration-500 rounded-2xl px-4 -mx-4",
      isActive && "bg-primary/5 border-primary/20 animate-pulse-subtle"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className={cn(
             "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
             isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 border border-primary/20 text-primary"
           )}>
            {numberInSurah}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-8 px-2 text-[10px] font-bold uppercase tracking-wider", showWords && "bg-primary/20 text-primary opacity-100")}
            onClick={toggleWords}
          >
            Word by Word
          </Button>
          <div className="w-px h-4 bg-border/40 mx-1" />
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", isActive && "text-primary opacity-100")} 
            onClick={handlePlay}
          >
            {isActive && isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", isActive && isLooping && "text-primary opacity-100")} 
            onClick={handleLoop}
            title="Memorization Mode (Repeat)"
          >
            <Repeat className={cn("h-4 w-4", isActive && isLooping && "animate-spin-slow")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLastRead}>
            <History className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBookmark}>
            {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyLink} title="Copy Link">
            <Copy className="h-4 w-4" />
          </Button>
          <ShareCard 
            arabicText={arabicText}
            translationText={translationText}
            surahName={surahName}
            surahNumber={surahNumber}
            ayahNumber={numberInSurah}
          />
        </div>
      </div>

      <div className="space-y-6">
        {showWords ? (
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-6" dir="rtl">
            {loadingWords ? (
              <p className="text-xs text-muted-foreground animate-pulse">Loading words...</p>
            ) : (
              words.map((word: any, i: number) => (
                <div key={i} className="flex flex-col items-center gap-2 group/word">
                  <span className="font-arabic text-2xl md:text-3xl text-foreground group-hover/word:text-primary transition-colors">
                    {word.text_uthmani}
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground font-serif dir-ltr">
                    {word.translation?.text || "..."}
                  </span>
                </div>
              ))
            )}
          </div>
        ) : (
          <p 
            className="font-arabic text-right leading-[1.8] text-foreground"
            style={{ fontSize: `${arabicFontSize}px` }}
            dir="rtl"
          >
            {arabicText}
          </p>
        )}
        <p 
          className="text-muted-foreground leading-relaxed"
          style={{ fontSize: `${translationFontSize}px` }}
        >
          {translationText}
        </p>
      </div>
    </div>
  )
}
