"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { History, ChevronRight, Trash2, Clock } from "lucide-react"
import { clearHistory } from "@/store/quranSlice"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export default function HistoryPage() {
  const dispatch = useAppDispatch()
  const { history } = useAppSelector((state) => state.quran)

  const handleClearHistory = () => {
    dispatch(clearHistory())
    toast.success("Reading history cleared")
  }

  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Reading History</span>} 
        subtitle="Keep track of your recent Quran reading activity" 
      />

      <div className="px-4 lg:px-8 space-y-4   mx-auto">
        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
              onClick={handleClearHistory}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-white/10">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No recent reading history found.</p>
            <Link href="/quran">
              <Button variant="link" className="text-primary mt-2">Resume Reading</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {history.map((item, index) => (
              <Link key={index} href={`/quran/${item.surahNumber}#ayah-${item.ayahNumber}`}>
                <div className="group bg-card/50 hover:bg-card/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">
                        {item.surahName} - Ayah {item.ayahNumber}
                      </h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </p>
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
