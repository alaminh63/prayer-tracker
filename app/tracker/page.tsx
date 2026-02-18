"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { SalatTracker } from "@/components/salat-tracker"

export default function TrackerPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Salat Tracker</span>} 
        subtitle="Keep track of your daily prayers and build a consistent habit" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <SalatTracker />
        </div>
      </div>
    </AppShell>
  )
}
