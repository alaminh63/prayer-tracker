"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { SettingsPanel } from "@/components/settings-panel"

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Settings"
        subtitle="Customize your prayer experience"
        showLocation={false}
        showDate={false}
      />
      <div className="px-4 lg:px-8">
        <div className="">
          <SettingsPanel />
        </div>
      </div>
    </AppShell>
  )
}
