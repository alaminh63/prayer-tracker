"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setShowSoftPrompt, fetchLocation } from "@/store/locationSlice"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export function LocationSoftPrompt() {
  const dispatch = useAppDispatch()
  const { showSoftPrompt, latitude } = useAppSelector((state) => state.location)
  const { t } = useTranslation()

  // If already have location or shouldn't show prompt, return null
  if (!showSoftPrompt || latitude) return null

  const handleAllow = () => {
    dispatch(setShowSoftPrompt(false))
    dispatch(fetchLocation())
  }

  const handleDismiss = () => {
    dispatch(setShowSoftPrompt(false))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-x-4 bottom-24 z-50 md:bottom-10 md:right-10 md:left-auto md:w-[380px]"
      >
        <div className="glass-card-strong overflow-hidden rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10">
          <div className="relative p-6">
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 text-primary shadow-inner">
                <Navigation className="h-8 w-8 animate-pulse" />
              </div>

              <h3 className="mb-2 text-lg font-bold text-foreground">
                {t.settings.auto_location}
              </h3>
              
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                {t.common.location_prompt_desc}
              </p>

              <div className="flex w-full gap-3">
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  className="flex-1 rounded-2xl border-border/50 hover:bg-secondary/50 font-semibold"
                >
                  {t.common.no_thanks}
                </Button>
                <Button
                  onClick={handleAllow}
                  className="flex-1 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {t.common.yes_allow}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 py-3 px-6 border-t border-primary/10">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-3 w-3 text-primary/60" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {t.common.privacy_note}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
