"use client"

import { AppShell } from "@/components/app-shell"
import { PremiumHomeHero } from "@/components/premium-home-hero"
import { PrayerList } from "@/components/prayer-list"
import dynamic from "next/dynamic"

const DailyReminder = dynamic(() => import("@/components/daily-reminder").then((mod) => ({ default: mod.DailyReminder })), { ssr: false })
const HadithCard = dynamic(() => import("@/components/hadith-card").then((mod) => ({ default: mod.HadithCard })), { ssr: false })
const RamadanStatus = dynamic(() => import("@/components/ramadan-status").then((mod) => ({ default: mod.RamadanStatus })), { ssr: false })
const PrayerTrackerSummary = dynamic(() => import("@/components/prayer-tracker-summary").then((mod) => ({ default: mod.PrayerTrackerSummary })), { ssr: false })
const IslamicKnowledgeCard = dynamic(() => import("@/components/islamic-knowledge-card").then((mod) => ({ default: mod.IslamicKnowledgeCard })), { ssr: false })
import { LocationRequired } from "@/components/location-required"
import { useAppSelector } from "@/store/hooks"
import { Clock, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

export default function HomePage() {
  const { t } = useTranslation()
  const { latitude } = useAppSelector((state) => state.location)

  return (
    <AppShell>
      <div className="flex flex-col gap-10 w-full mx-auto px-4 lg:px-8 pb-20 pt-6">
        
        {/* Premium Hero Section */}
        <PremiumHomeHero />

        {/* Location required guard */}
        {!latitude ? (
          <LocationRequired />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Main Content Area (Left/Center) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Prayer Times Section */}
              <section aria-label="Today's prayer times" className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                      <Clock className="h-6 w-6 text-primary" />
                      {t.common.today_prayer_times}
                    </h2>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">{t.common.location_schedule}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {t.common.live_updates}
                    </span>
                  </div>
                </div>
                
                <div className="bg-card backdrop-blur-3xl rounded-[3rem] p-3 border border-border shadow-xl">
                  <PrayerList />
                </div>
              </section>

              {/* Daily Dynamic Reminder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-10"
              >
                <DailyReminder />
              </motion.div>

              <HadithCard />
            </div>

            {/* Sidebar / Secondary Content (Right) */}
            <aside className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex flex-col gap-8 sticky top-24">
                <RamadanStatus />
                <PrayerTrackerSummary />
                <IslamicKnowledgeCard />
              </div>
            </aside>
            
          </div>
        )}
      </div>
    </AppShell>
  )
}

