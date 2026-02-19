"use client"

import { AppShell } from "@/components/app-shell"
import { PremiumHomeHero } from "@/components/premium-home-hero"
import { PrayerList } from "@/components/prayer-list"
import { DailyReminder } from "@/components/daily-reminder"
import { HadithCard } from "@/components/hadith-card"
import { RamadanStatus } from "@/components/ramadan-status"
import { PrayerTrackerSummary } from "@/components/prayer-tracker-summary"
import { SehriIftarHero } from "@/components/sehri-iftar-hero"
import { Clock, Star } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-10 w-full mx-auto px-4 lg:px-8 pb-20 pt-6">
        
        {/* Premium Hero Section */}
        <PremiumHomeHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Content Area (Left/Center) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Prayer Times Section */}
            <section aria-label="Today's prayer times" className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    আজকের নামাজের সময়
                  </h2>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Current schedule for your location</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Live Updates
                  </span>
                </div>
              </div>
              
              <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[3rem] p-3 border border-white/5 ring-1 ring-white/5">
                <PrayerList />
              </div>
            </section>

            {/* Daily Dynamic Reminder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <DailyReminder />
            </motion.div>
          </div>

          {/* Sidebar / Secondary Content (Right) */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-8 sticky top-24">
              <RamadanStatus />
              <PrayerTrackerSummary />
              <HadithCard />
              <SehriIftarHero />
              
              {/* Premium Quote Card */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary/20 to-primary/5 p-8 border border-primary/20 group">
                <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/20 blur-3xl rounded-full group-hover:scale-150 transition-transform" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <Star className="h-5 w-5 fill-primary" />
                  </div>
                  <h4 className="text-lg font-black text-white tracking-tight">আপনি কি জানেন?</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-bold">
                    সেজদাহ হলো বান্দার জন্য আল্লাহর সবচেয়ে নিকটতম হওয়ার সময়। সিজদায় বেশি বেশি দুআ করুন।
                  </p>
                  <div className="h-1 w-12 bg-primary/40 rounded-full" />
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </AppShell>
  )
}
