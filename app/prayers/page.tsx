"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { PrayerDetailGrid } from "@/components/prayer-detail-grid"

export default function PrayersPage() {
  return (
    <AppShell>
      <PageHeader
        title="Prayer Times"
        subtitle="Detailed view with all timings"
      />
      <div className="px-4 lg:px-8">
        <div className="">
          <PrayerDetailGrid />
        </div>
      </div>
    </AppShell>
  )
}
