"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { NamesOfAllah } from "@/components/names-of-allah"

export default function NamesPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">99 Names of Allah</span>} 
        subtitle="Learn and reflect on the beautiful names of the Almighty" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <NamesOfAllah />
        </div>
      </div>
    </AppShell>
  )
}
