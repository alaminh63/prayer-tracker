"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { HijriCalendar } from "@/components/hijri-calendar"

export default function CalendarPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Islamic Calendar</span>} 
        subtitle="Hijri date and upcoming Islamic events" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <HijriCalendar />
        </div>
      </div>
    </AppShell>
  )
}
