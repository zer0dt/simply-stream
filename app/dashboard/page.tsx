import { Metadata } from "next"

import { dateRangeParams } from "@/lib/utils"

import { DateRangePicker } from "@/components/date-range-picker"
import { Shell } from "@/components/layout/shell"
import { DashboardCards } from "@/components/pages/dashboard/dashboard-cards"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Monitor your progress.",
}

interface DashboardProps {
  searchParams: { from: string; to: string }
}

export default function Dashboard({ searchParams }: DashboardProps) {
 
  const dateRange = dateRangeParams(searchParams)

  return (
    <Shell>
      <DashboardHeader heading="Dashboard" text="Monitor your bitcoin unlocks.">
        <DateRangePicker />
      </DashboardHeader>
    </Shell>
  )
}
