

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"

import { ActivityAddButton } from "./stream-add-button"
import { ActivityItem } from "./stream-item"
import { formatDate } from "@/lib/utils"

interface StreamListProps {
    lockstreams: {
        id: string,
        createdDate: Date,
        userId: string;
        name: string;
        startDate: string;
        endDate: string;
        totalSatoshisLocked: string; // Assuming string to handle large numbers
        satoshisUnlockedPerDay: string; // Assuming string to handle large numbers
        streamPubkey: string;
        fundingAddress: string;
    }[]
    identityPubKey: string | undefined
}

export function ActivityList({ lockstreams, identityPubKey }: StreamListProps) {

  
  return (
    <>
      {lockstreams.length ? (
        <>
          {lockstreams.map((lockstream) => (
            <ActivityItem key={lockstream.id} lockstream={lockstream} identityPubKey={identityPubKey} />
          ))}
        </>
      ) : (
        <EmptyPlaceholder>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.activity className="h-10 w-10" />
          </div>
          <EmptyPlaceholder.Title>No activities created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Add an activity to start monitoring your progress.
          </EmptyPlaceholder.Description>
          <ActivityAddButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  )
}