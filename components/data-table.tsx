"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Icons } from "./icons"
import { toast } from "./ui/use-toast"
import { Router } from "lucide-react"
import router from "next/navigation"
import Link from "next/link"
import { getTransactionInfoforTable, VoutInfo } from "@/app/actions"
import { useEffect, useState } from "react"
import Loading from "@/app/(frontpage)/loading"
import { ReloadIcon } from "@radix-ui/react-icons"

import { StreamUnlockButton } from "./stream/stream-unlock-button"

interface DataTableProps {
  txid: string
  children?: React.ReactNode
}

const toISOFormat = (unixTimestamp: number) => {
  return new Date(unixTimestamp * 1000).toISOString();
};

export function DataTable({
  txid,
  children,
}: DataTableProps) {
  const [transactionData, setTransactionData] = useState<VoutInfo[]>([]);

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [loading, setLoading] = useState(true)
 

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const data = await getTransactionInfoforTable(txid);
        setTransactionData(data);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        setLoading(false)
      }
    };

    fetchTransactionData();
  }, [txid])

  // Define columns based on VoutInfo
  const columns: ColumnDef<VoutInfo>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Unlock Timestamp',
      cell: (info) => formatDate(toISOFormat(Number(info.getValue())))
    },
    {
      accessorKey: 'value',
      header: 'Value',
    },
    {
      accessorKey: 'index',
      header: 'Output',
    },
    {
      id: 'action', // unique ID for the column
      header: () => <div className="text-right pr-6">Action</div>,
      cell: (info) => (
        <div className="text-right">
          <StreamUnlockButton variant="outline" 
            txid={txid}
            value={info.row.original.value}
            output={info.row.original.index}
            script={info.row.original.script}
          />
        </div>
      )
    },
  ];

  const table = useReactTable({
    data: transactionData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });


  return (
    <div className="w-full overflow-x-auto">
      <div className="mb-4 flex items-center px-2 pt-1">
        {children ? (
          <>
            <a target="_blank" href={"https://whatsonchain.com/tx/" + children} className="text-lg font-medium" rel="noopener noreferrer">
              <div className="flex items-center">
                {children.toString().slice(0, 8) + "..." + children.toString().slice(-8)}
                <Icons.link className="ml-2 h-3 w-3" />
              </div>
            </a>
          </>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Icons.mixer className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {loading ? <Loading /> : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
