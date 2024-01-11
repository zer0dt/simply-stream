'use client'

import { Metadata } from "next"
import { redirect } from "next/navigation"

import { ActivityAddButton } from "@/components/stream/stream-add-button"
import { ActivityItem } from "@/components/stream/stream-item"
import { ActivityList } from "@/components/stream/stream-list"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

import { WalletContext } from '@/app/context/WalletContextProvider'
import { useContext, useEffect, useState } from "react"

import { getUserLockstreams } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"
import Loading from "../loading"
import { Lockstream } from "@prisma/client"

export default function ActivitiesPage() {
  const { identityPubKey } = useContext(WalletContext)!;

  const [isLoading, setIsLoading] = useState(true)

  const [lockstreams, setLockstreams] = useState<Lockstream[]>([])


  useEffect(() => {
    const handleConnect = async () => {
      try {
        if (identityPubKey) {
          console.log(identityPubKey);

          try {
            const lockstreams = await getUserLockstreams(identityPubKey)

            setLockstreams(lockstreams)
            setIsLoading(false)
          } catch (error) {
            console.error("Error fetching lockstream:", error);
            toast({
              title: "Error",
              description: "Unable to fetch lockstream data.",
              variant: "destructive",
            });
            setIsLoading(false)
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Panda Wallet dismissed",
          variant: "destructive",
        });
        setIsLoading(false)
      }
      setIsLoading(false)
    }

    handleConnect();
  }, [identityPubKey]);

  return (
    <Shell>
      <DashboardHeader heading="Lock Streams" text="Create a stream of bitcoin locks.">
        <ActivityAddButton />
      </DashboardHeader>

      {isLoading ? (
        <Loading />
      ) : lockstreams.length ? (
        <div className="divide-y divide-border rounded-md border">
          <ActivityList lockstreams={lockstreams} identityPubKey={identityPubKey} />
        </div>
      ) : (
        <EmptyPlaceholder>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.lock className="h-10 w-10" />
          </div>
          <EmptyPlaceholder.Title>No lockstreams created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Create a lockstream to lock bitcoin into the future.
          </EmptyPlaceholder.Description>
          <ActivityAddButton variant="outline" />
        </EmptyPlaceholder>
      )
      }
    </Shell>
  )
}
