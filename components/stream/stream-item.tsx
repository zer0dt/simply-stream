"use client"

import Link from "next/link"
import { Lockstream } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ActivityOperations } from "@/components/stream/stream-operations"
import { SiBitcoinsv } from "react-icons/si"

interface ActivityItemProps {
  lockstream: Lockstream,
  identityPubKey: string | undefined
}

export function ActivityItem({ lockstream, identityPubKey }: ActivityItemProps) {
  // Convert Unix timestamp to ISO 8601 format
  const toISOFormat = (unixTimestamp: number) => {
    return new Date(unixTimestamp * 1000).toISOString();
  };

  // Format start and end dates
  const formattedStartDate = formatDate(toISOFormat(Number(lockstream.startDate)));
  const formattedEndDate = formatDate(toISOFormat(Number(lockstream.endDate)));

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
          <SiBitcoinsv className={lockstream.funded ? "text-orange-400 h-4 w-4" : "h-4 w-4"} />
            <p className="ml-2">{(Number(lockstream.totalSatoshisLocked) / 100000000).toFixed(8)}</p>            
          </div>
          <div>
            <Link
              href={`/dashboard/streams/${lockstream.id}`}
              className="font-semibold hover:underline"
            >
              {lockstream.name}
            </Link>
            <div>
              <p className="text-sm text-muted-foreground">
                {formatDate(lockstream.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {formattedStartDate + " - " + formattedEndDate}
        </div>

        <div className="flex justify-end">
          <ActivityOperations lockstream={lockstream} identityPubKey={identityPubKey} />
        </div>


      </div>

    </div>
  )
}

ActivityItem.Skeleton = function ActivityItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
