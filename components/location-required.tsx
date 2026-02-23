"use client"

import { motion } from "framer-motion"
import { MapPin, Navigation, Shield, Clock, Compass } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchLocation, setManualLocation } from "@/store/locationSlice"
import { useTranslation } from "@/hooks/use-translation"

const features = [
  { icon: Clock, labelEn: "Accurate Prayer Times", labelBn: "নির্ভুল নামাজের সময়" },
  { icon: Compass, labelEn: "Qibla Direction", labelBn: "কেবলার দিক" },
  { icon: Shield, labelEn: "Privacy Protected", labelBn: "গোপনীয়তা সুরক্ষিত" },
]

// Dhaka default coordinates
const DHAKA = { latitude: 23.8103, longitude: 90.4125 }

export function LocationRequired() {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.location)
  const { language } = useAppSelector((state) => state.settings)
  const { t } = useTranslation()

  const handleAllow = () => {
    dispatch(fetchLocation())
  }

  const handleSkip = () => {
    dispatch(setManualLocation(DHAKA))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card shadow-2xl shadow-primary/5 min-h-[480px] flex flex-col items-center justify-center p-8 md:p-16 text-center"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      {/* Icon */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-xl shadow-primary/10"
      >
        <Navigation className="h-12 w-12 text-primary" />
        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
        </span>
      </motion.div>

      {/* Heading */}
      <div className="relative z-10 max-w-md">
        <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-3">
          {language === "bn"
            ? "অবস্থান অনুমতি প্রয়োজন"
            : "Location Permission Required"}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          {t.common.location_prompt_desc}
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 flex flex-wrap justify-center gap-3 mb-10">
        {features.map(({ icon: Icon, labelEn, labelBn }) => (
          <div
            key={labelEn}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border text-sm font-semibold text-foreground"
          >
            <Icon className="h-4 w-4 text-primary" />
            {language === "bn" ? labelBn : labelEn}
          </div>
        ))}
      </div>

      {/* Primary CTA */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleAllow}
        disabled={loading}
        className="relative z-10 inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-xl shadow-primary/30 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <>
            <span className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            {t.common.detecting}
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5" />
            {t.common.yes_allow}
          </>
        )}
      </motion.button>

      {/* Privacy note */}
      <p className="relative z-10 mt-4 text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
        <Shield className="h-3 w-3 text-primary/60" />
        {t.common.privacy_note}
      </p>

      {/* Skip / default location option */}
      <div className="relative z-10 mt-6 pt-6 border-t border-border/50 w-full max-w-xs">
        <p className="text-[11px] text-muted-foreground mb-3 font-medium">
          {language === "bn"
            ? "লোকেশন না দিতে চাইলে ঢাকার সময়সূচী দেখুন"
            : "Don't want to share? Use Dhaka prayer times."}
        </p>
        <button
          onClick={handleSkip}
          disabled={loading}
          className="w-full py-2.5 rounded-xl border border-border/60 text-sm font-bold text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {language === "bn" ? "🕌 ঢাকার সময় দেখান" : "🕌 Continue with Dhaka"}
        </button>
      </div>
    </motion.div>
  )
}
