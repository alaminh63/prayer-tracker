"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { TasbihCounter } from "@/components/tasbih-counter"

export default function TasbihPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Digital Tasbih</span>} 
        subtitle="Perform dhikr with haptic feedback and session tracking" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <TasbihCounter />
        </div>
      </div>
    </AppShell>
  )
}
