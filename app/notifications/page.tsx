"use client"

import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { NotificationManager } from "@/components/notification-manager"

export default function NotificationsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        subtitle="Manage your Azan and prayer alerts"
        showLocation={false}
        showDate={false}
      />
      <div className="px-4 lg:px-8">
        <div className="">
          <NotificationManager />
        </div>
      </div>
    </AppShell>
  )
}
