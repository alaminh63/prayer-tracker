"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { AzkarViewer } from "@/components/azkar-viewer"

export default function AzkarPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Masnoon Azkar</span>} 
        subtitle="Morning and evening supplications from the Sunnah" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <AzkarViewer />
        </div>
      </div>
    </AppShell>
  )
}
