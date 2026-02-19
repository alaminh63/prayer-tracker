"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Download, Copy, Check } from "lucide-react"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ShareCardProps {
  arabicText: string
  translationText: string
  surahName: string
  surahNumber: number
  ayahNumber: number
}

export const ShareCard = ({ arabicText, translationText, surahName, surahNumber, ayahNumber }: ShareCardProps) => {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleCopyText = () => {
    const text = `"${translationText}"\n\n— ${surahName} (${surahNumber}:${ayahNumber})\n\nRead more at: ${window.location.origin}/quran/${surahNumber}#ayah-${ayahNumber}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Text copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const text = `${surahName} (${surahNumber}:${ayahNumber})\n\n${translationText}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ayah ${ayahNumber} from ${surahName}`,
          text: text,
          url: `${window.location.origin}/quran/${surahNumber}#ayah-${ayahNumber}`
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      handleCopyText()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Ayah
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Visual Preview */}
          <div 
            ref={cardRef}
            className="relative overflow-hidden aspect-4/5 rounded-3xl bg-linear-to-br from-zinc-900 via-zinc-950 to-emerald-950/20 border border-white/5 p-8 flex flex-col justify-center items-center text-center group"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full space-y-8">
              <h4 className="font-arabic text-3xl md:text-4xl text-emerald-100/90 leading-[1.6]" dir="rtl">
                {arabicText}
              </h4>
              <div className="w-12 h-px bg-primary/30 mx-auto" />
              <p className="text-zinc-300 text-sm md:text-base italic leading-relaxed font-serif">
                "{translationText}"
              </p>
              <div className="pt-4">
                <p className="text-primary font-bold text-xs tracking-widest uppercase">
                  {surahName} • {surahNumber}:{ayahNumber}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">Salat Time App</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 gap-2"
              onClick={handleCopyText}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy Text"}
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share Link
            </Button>
          </div>
          
          <p className="text-[10px] text-center text-zinc-500 italic">
            Hint: You can also take a screenshot of the card above to share as an image!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
