"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Surah } from "@/hooks/use-quran"
import { cn } from "@/lib/utils"

interface SurahCardProps {
  surah: Surah
}

export const SurahCard = ({ surah }: SurahCardProps) => {
  return (
    <Link href={`/quran/${surah.number}`}>
      <Card className="group hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <span className="text-6xl font-bold">{surah.number}</span>
        </div>
        <CardContent className="p-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              {surah.number}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{surah.englishName}</h3>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">{surah.revelationType} • {surah.numberOfAyahs} AYATS</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-arabic text-2xl leading-tight mb-1">{surah.name}</h3>
            <p className="text-primary text-sm font-medium">{surah.englishNameTranslation}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
