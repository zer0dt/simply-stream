import { Metadata } from "next"
import { redirect } from "next/navigation"


import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { AppearanceForm } from "@/components/settings/appearance-form"


export const metadata: Metadata = {
  title: "Settings",
  description: "Manage account and app settings.",
}

export default async function SettingsPage() {


  return (
    <Shell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and app settings."
      />
      <div className="grid grid-cols-1 gap-6">

        <AppearanceForm />
      </div>
    </Shell>
  )
}
