"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { ZakatCalculator } from "@/components/zakat-calculator"

export default function ZakatPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Zakat Calculator</span>} 
        subtitle="Estimate your annual zakat obligation easily" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <ZakatCalculator />
        </div>
      </div>
    </AppShell>
  )
}
