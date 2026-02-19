"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { useAppSelector } from "@/store/hooks"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bookmark, ChevronRight, BookOpen } from "lucide-react"

export default function BookmarksPage() {
  const { bookmarks } = useAppSelector((state) => state.quran)

  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Bookmarks</span>} 
        subtitle="Your favorite verses from the Holy Quran" 
      />

      <div className="px-4 lg:px-8 space-y-4">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-white/10">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">You haven't bookmarked any ayahs yet.</p>
            <Link href="/quran">
              <Button variant="link" className="text-primary mt-2">Start Reading</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {bookmarks.map((bookmark, index) => (
              <Link key={index} href={`/quran/${bookmark.surahNumber}#ayah-${bookmark.ayahNumber}`}>
                <div className="group bg-card/50 hover:bg-card/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Bookmark className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Ayah {bookmark.ayahNumber}</h3>
                      <p className="text-xs text-muted-foreground">Surah {bookmark.surahNumber}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
