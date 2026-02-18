"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { DuaList } from "@/components/dua-list"

export default function DuasPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">Essential Duas</span>} 
        subtitle="Daily supplications for various occasions" 
      />

      <div className="px-4 lg:px-8 pb-10">
        <div className="">
          <DuaList />
        </div>
      </div>
    </AppShell>
  )
}
