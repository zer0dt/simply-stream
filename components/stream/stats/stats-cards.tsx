"use client"

import { SearchParams } from "@/types"

import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface StatsCardsProps {
  lockstream: {
    userId: string;
    name: string;
    description: string;
    startDate: bigint;
    endDate: bigint; 
    totalSatoshisLocked: bigint; 
    satoshisUnlockedPerDay: bigint;
    streamPubkey: string;
    fundingAddress: string;
  }
}
 

export function StatsCards({ lockstream }: StatsCardsProps) {
  // Convert Unix timestamp to ISO 8601 format
  const toISOFormat = (unixTimestamp: number) => {
    return new Date(unixTimestamp*1000).toISOString();
  };

  // Format start and end dates
  const formattedStartDate = formatDate(toISOFormat(Number(lockstream.startDate)));
  const formattedEndDate = formatDate(toISOFormat(Number(lockstream.endDate)));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Locked</CardTitle>
          <Icons.fire className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Number(lockstream.totalSatoshisLocked)/100000000}</div>
          <p className="text-xs text-muted-foreground">bitcoin</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unlock per day</CardTitle>
          <Icons.statsBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Number(lockstream.satoshisUnlockedPerDay)/100000000}</div>
          <p className="text-xs text-muted-foreground">bitcoin</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Starting Date</CardTitle>
          <Icons.history className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedStartDate}</div>
          <p className="text-xs text-muted-foreground">
            {Number(lockstream.startDate)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">End Date</CardTitle>
          <Icons.calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedEndDate}</div>
          <p className="text-xs text-muted-foreground">
           {Number(lockstream.endDate)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
