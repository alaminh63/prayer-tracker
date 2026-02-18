"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { QiblaCompass } from "@/components/qibla-compass"

export default function QiblaPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Qibla Direction</span>} 
        subtitle="Find the direction of the Kaaba from your current location" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <QiblaCompass />
        </div>
      </div>
    </AppShell>
  )
}
