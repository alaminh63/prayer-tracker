"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setArabicFontSize, setTranslationFontSize, setTranslationEdition, setReciter } from "@/store/quranSlice"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings2, Type, Mic2 } from "lucide-react"

export const QuranSettings = () => {
  const dispatch = useAppDispatch()
  const { arabicFontSize, translationFontSize, translationEdition, reciter } = useAppSelector((state) => state.quran)

  return (
    <div className="space-y-8 p-1">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Type className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm">Font Settings</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Arabic Font Size</Label>
            <span className="text-xs font-medium">{arabicFontSize}px</span>
          </div>
          <Slider
            value={[arabicFontSize]}
            min={20}
            max={60}
            step={1}
            onValueChange={([val]) => dispatch(setArabicFontSize(val))}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Translation Font Size</Label>
            <span className="text-xs font-medium">{translationFontSize}px</span>
          </div>
          <Slider
            value={[translationFontSize]}
            min={12}
            max={32}
            step={1}
            onValueChange={([val]) => dispatch(setTranslationFontSize(val))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Mic2 className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm">Recitation</h4>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Select Reciter</Label>
          <Select
            value={reciter}
            onValueChange={(val) => dispatch(setReciter(val))}
          >
            <SelectTrigger className="bg-card/50 border-white/10">
              <SelectValue placeholder="Select Reciter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar.alafasy">Mishary Rashid Alafasy</SelectItem>
              <SelectItem value="ar.abdulbasitmurattal">Abdul Basit (Murattal)</SelectItem>
              <SelectItem value="ar.abdullahbasfar">Abdullah Basfar</SelectItem>
              <SelectItem value="ar.sudais">Abdurrahmaan As-Sudais</SelectItem>
              <SelectItem value="ar.minshawi">Al Minshawi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm">Translation Edition</h4>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Bengali Edition</Label>
          <Select
            value={translationEdition}
            onValueChange={(val) => dispatch(setTranslationEdition(val))}
          >
            <SelectTrigger className="bg-card/50 border-white/10">
              <SelectValue placeholder="Select Edition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bn.bengali">মুনিরুজ্জামান (Muniruzzaman)</SelectItem>
              <SelectItem value="bn.baian">বায়ান (Baian)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
