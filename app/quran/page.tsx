"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { useSurahs } from "@/hooks/use-quran"
import { SurahCard } from "@/components/quran/surah-card"
import { Input } from "@/components/ui/input"
import { Search, BookMarked, History } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function QuranPage() {
  const { surahs, isLoading } = useSurahs()
  const [searchQuery, setSearchQuery] = useState("")
  const { lastRead } = useAppSelector((state) => state.quran)

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery)
  )

  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Al Quran</span>} 
        subtitle="Read and understand the Holy Quran" 
      />

      <div className="px-4 lg:px-8 space-y-6">
        {/* Last Read & Search Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Surah (e.g. Al-Fatihah, 1)"
              className="pl-10 h-12 bg-card/50 border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {lastRead && (
              <Link href={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`} className="flex-1 md:flex-none">
                <Button className="w-full h-12 px-6 gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20" variant="outline">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Last Read: {lastRead.surahName}</span>
                  <span className="sm:hidden">Last Read</span>
                </Button>
              </Link>
            )}
            
            <Link href="/quran/history">
              <Button className="h-12 px-6 gap-2 bg-secondary/50 hover:bg-secondary/80 border-white/10" variant="outline">
                <History className="h-4 w-4 text-muted-foreground" />
                <span>History</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Surah Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-card/50 animate-pulse border border-white/5" />
            ))
          ) : (
            filteredSurahs.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))
          )}
        </div>

        {!isLoading && filteredSurahs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No surah found matching your search.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
