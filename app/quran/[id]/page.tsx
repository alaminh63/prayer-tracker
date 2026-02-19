"use client"

import { useSurah } from "@/hooks/use-quran"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { AyahItem } from "@/components/quran/ayah-item"
import { QuranSettings } from "@/components/quran/quran-settings"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Settings2, Download, BookOpen } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setActiveAudioAyah } from "@/store/quranSlice"
import { Play } from "lucide-react"

export default function SurahDetailPage() {
  const params = useParams()
  const dispatch = useAppDispatch()
  const surahNumber = Number(params.id)
  const { arabicSurah, bengaliSurah, isLoading } = useSurah(surahNumber)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash) {
        const id = hash.replace("#", "")
        const element = document.getElementById(id)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
            element.classList.add("ring-2", "ring-primary", "rounded-2xl", "duration-1000")
            setTimeout(() => {
              element.classList.remove("ring-2", "ring-primary")
            }, 3000)
          }, 500)
        }
      }
    }
  }, [isLoading])

  if (!mounted) return null

  return (
    <AppShell>
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 py-3 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/quran">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h2 className="font-bold text-sm lg:text-base leading-none">
                {isLoading ? "Loading..." : arabicSurah?.englishName}
              </h2>
              <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">
                {isLoading ? "Please wait" : `${arabicSurah?.revelationType} • ${arabicSurah?.numberOfAyahs} Ayahs`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isLoading && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 gap-2 bg-primary/10 border-primary/20 text-primary rounded-full hover:bg-primary/20"
                onClick={() => dispatch(setActiveAudioAyah({ 
                  surahNumber, 
                  ayahNumber: 1, 
                  totalAyahs: arabicSurah?.numberOfAyahs 
                }))}
              >
                <Play className="h-4 w-4 fill-current" />
                <span className="hidden sm:inline">Play All</span>
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 gap-2 bg-secondary/50 border-white/5 rounded-full">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="mb-6">
                  <SheetTitle>Quran Reader Settings</SheetTitle>
                  <SheetDescription>
                    Customize your reading experience
                  </SheetDescription>
                </SheetHeader>
                <QuranSettings />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 max-w-4xl mx-auto py-8">
        {/* Bismillah */}
        {!isLoading && surahNumber !== 1 && surahNumber !== 9 && (
          <div className="text-center mb-12 py-8 bg-primary/5 rounded-3xl border border-primary/10">
            <p className="font-arabic text-3xl text-primary mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">In the name of Allah, the Entirely Merciful, the Especially Merciful</p>
          </div>
        )}

        {/* Ayah List */}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="py-8 space-y-4 animate-pulse">
                <div className="h-4 w-8 bg-card rounded" />
                <div className="h-10 w-full bg-card rounded" />
                <div className="h-6 w-3/4 bg-card rounded" />
              </div>
            ))
          ) : (
            arabicSurah?.ayahs.map((ayah, index) => (
              <div key={ayah.number} id={`ayah-${ayah.numberInSurah}`}>
                <AyahItem
                  numberInSurah={ayah.numberInSurah}
                  arabicText={ayah.text}
                  translationText={bengaliSurah?.ayahs[index]?.text || ""}
                  surahNumber={surahNumber}
                  surahName={arabicSurah.englishName}
                  totalAyahs={arabicSurah.numberOfAyahs}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
