'use client'


import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { UnlockButton } from "@/components/unlock/unlock-button"


export default function UnlockPage() {
  
  return (
    <Shell>
      <DashboardHeader heading="Unlock" text="Scan and broadcast unlocking transaction.">
        <UnlockButton />
      </DashboardHeader>
    </Shell>
  )
}
