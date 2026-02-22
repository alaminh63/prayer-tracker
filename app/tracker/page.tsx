"use client"

import React from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { DeedsTracker } from "@/components/deeds-tracker"
import { TrackingHistoryCalendar } from "@/components/tracking-history-calendar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Activity, Sparkles, Heart, ShieldCheck, Target, Award, LayoutDashboard, History } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function TrackerPage() {
  const { t } = useTranslation()
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">{t.tracker.title}</span>} 
        subtitle={t.tracker.subtitle} 
      />

      <div className="px-4 lg:px-8 pb-20 flex flex-col gap-10 w-full mx-auto">
        
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-secondary border border-border p-1.5 rounded-2xl h-auto backdrop-blur-xl ring-1 ring-border">
              <TabsTrigger value="overview" className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-500 gap-2 text-muted-foreground">
                <LayoutDashboard size={18} />
                <span className="font-black uppercase  ">{t.tracker.today_deeds}</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-500 gap-2 text-muted-foreground">
                <History size={18} />
                <span className="font-black uppercase  ">{t.tracker.history}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 focus-visible:outline-hidden">
            <div className="grid grid-cols-1 gap-10">
              <DeedsTracker />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 focus-visible:outline-hidden">
            <div className="grid grid-cols-1 gap-10">
              <TrackingHistoryCalendar fullWidth />
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats / Info Section */}
        <section className="width-full grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 rounded-4xl bg-card border border-border flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-black text-foreground dark:text-white">{t.tracker.regular_tracking}</h3>
              <p className="text-sm text-muted-foreground">{t.tracker.regular_desc}</p>
           </div>
           
           <div className="p-8 rounded-4xl bg-card border border-border flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-black text-foreground dark:text-white">{t.tracker.spiritual_progress}</h3>
              <p className="text-sm text-muted-foreground">{t.tracker.progress_desc}</p>
           </div>

           <div className="p-8 rounded-4xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center gap-4 shadow-xs">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-black text-foreground dark:text-white">{t.tracker.ikhlas}</h3>
              <p className="text-sm text-muted-foreground">{t.tracker.ikhlas_desc}</p>
           </div>
        </section>
      </div>
    </AppShell>
  )
}
