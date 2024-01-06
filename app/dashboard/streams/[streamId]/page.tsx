'use client'

import { Metadata } from "next"
import NotFound from "./not-found"

import { cn, dateRangeParams, formatDate } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ActivityOperations } from "@/components/stream/stream-operations"
import { logColumns } from "@/components/stream/logs/logs-columns"
import { StatsCards } from "@/components/stream/stats/stats-cards"
import { Heatmap } from "@/components/charts/heatmap"
import { DataTable } from "@/components/data-table"
import { DateRangePicker } from "@/components/date-range-picker"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

import { WalletContext } from '@/app/context/WalletContextProvider'
import { useEffect, useState, useContext } from "react"

import { getLockstream, getTransactionInfoforTable } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"
import Loading from "../../loading"
import { FundStreamButton } from "@/components/stream/fund-stream-button"
import { Lockstream } from "@prisma/client"

import { bsv } from "scrypt-ts"


interface ActivityPageProps {
  params: { streamId: string }
}

const getAddress = (pubkey: string) => {
  const publicKey = bsv.PublicKey.fromString(pubkey);
  const address = publicKey.toAddress();

  return address.toString()
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const { identityPubKey } = useContext(WalletContext)!;

  const [lockstream, setLockstream] = useState<Lockstream | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true); // New state for managing loading

  useEffect(() => {
    const handleConnect = async () => {

      if (identityPubKey) {
        try {
          const lockstreamData = await getLockstream(params.streamId, identityPubKey)
          setLockstream(lockstreamData);
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
    }

    handleConnect();
  }, [identityPubKey]);

  return (
    <Shell>
      {isLoading ? (
        <Loading />
      ) : lockstream ? (
        <>
          <DashboardHeader
            heading={`${lockstream.name}`}
            text={formatDate(lockstream.createdAt.toISOString())}
          >
            {!lockstream.funded ? (
              <FundStreamButton lockstream={lockstream} />
            ) : lockstream.streamPubkey ? (
              <a target="_blank" href={"https://whatsonchain.com/address/" + getAddress(lockstream.streamPubkey)} rel="noopener noreferrer">
                <Button variant="ghost">
                  {getAddress(lockstream.streamPubkey)}
                </Button>
              </a>
            ) : null}
          </DashboardHeader>
          <StatsCards lockstream={lockstream} />
          {(lockstream.funded && lockstream.txid) ? (
            <DataTable txid={lockstream.txid} columns={logColumns} >
              {lockstream.txid}
            </DataTable>
          ) : null}

        </>
      ) : (
        <NotFound />
      )}
    </Shell>
  );
}