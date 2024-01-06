'use client'


import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { WalletContext } from '@/app/context/WalletContextProvider'
import { useContext, useEffect } from "react"

import { SiBitcoinsv } from "react-icons/si";

export function UserNavDisplay() {
  const { handleConnect, satoshiBalance } = useContext(WalletContext)!;
 
    return (
      <h1
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        {satoshiBalance ? <button className="flex justify-center items-center text-white h-13 px-5 py-1 font-medium rounded-xl hover:shadow-md transition-shadow duration-300">{satoshiBalance / 100000000}<SiBitcoinsv className="pl-1 h-5 w-5 text-orange-400" /></button>
          : <button onClick={handleConnect} className="flex justify-center items-center text-white h-13 px-5 py-1 font-medium rounded-xl hover:shadow-md transition-shadow duration-300">Connect Wallet</button>
        }
      </h1>
    )
}
