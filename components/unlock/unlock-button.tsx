"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

import { WalletContext } from '@/app/context/WalletContextProvider'
import { createNewLockstream } from "@/app/actions"

import { QrReader } from 'react-qr-reader';

interface UnlockButtonProps extends ButtonProps { }


export function UnlockButton({
  className,
  variant,
  ...props
}: UnlockButtonProps) {

    const [openQRScanner, setOpenQRScanner] = useState(false)
    const [decodedQR, setDecodedQR] = useState<string |undefined>()

  const handleSubmit = async () => {
    setOpenQRScanner(true)
     
  };

  const decode = (result: string) => {
    console.log(result)
    setDecodedQR(result)
    setOpenQRScanner(false)
  }

  const decodeError = (error: Error) => {
    console.log(error?.message)
    toast({
        title: "Error",
        description: error?.message,
        variant: "destructive", // adjust based on your toast library's API
      });
  }

  return (
    <>

      {/* Add Alert */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Unlock</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unlock a transaction</DialogTitle>
            <DialogDescription>
              Scan and broadcast the unlocked transaction.
            </DialogDescription>
          </DialogHeader>
        
            {openQRScanner ? (
                <QrReader
                onResult={(result, error) => {
                  if (!!result) {
                    setDecodedQR(result?.text);
                  }
        
                  if (!!error) {
                    console.info(error);
                  }
                }}
                style={{ width: '100%' }}
              />
            ) : decodedQR ? (
                <p>{decodedQR}</p>
            ) : null}



          <DialogFooter>
              <Button variant="outline" type="submit" onClick={handleSubmit}>Scan</Button>           
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
