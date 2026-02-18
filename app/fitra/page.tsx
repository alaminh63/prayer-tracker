"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { FitraCalculator } from "@/components/fitra-calculator"

export default function FitraPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Fitra Calculator</span>} 
        subtitle="Calculate Sadaqatul Fitr for your family members" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <FitraCalculator />
        </div>
      </div>
    </AppShell>
  )
}
