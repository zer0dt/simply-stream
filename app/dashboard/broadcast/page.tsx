'use client'


import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Icons } from "@/components/icons"



function base64ToHex(base64: string) {
  const raw = atob(base64);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return result;
}


export default function BroadcastPage() {

  const [base64Result, setBase64Result] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const [txid, setTxid] = useState<string | undefined>()

  const handleSubmit = async (base64Result: string | undefined) => {
    setIsLoading(true)

    if (!base64Result) {
      console.error("No result to process");
      toast({
        title: "Error",
        description: "No result to process.",
        variant: "destructive", // adjust based on your toast library's API
      });
      setIsLoading(false)
      return;
    }

    try {
      const hexResult = base64ToHex(base64Result);

      console.log(hexResult)

      // Broadcasting the transaction
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rawTx: hexResult })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData)
      const responseDataParse = JSON.parse(responseData);
      console.log(responseDataParse)
      const payloadData = JSON.parse(responseDataParse.payload)
      console.log(payloadData)
      const txid = payloadData.txid;

      if (txid) {
        console.log('Transaction broadcasted:', txid);

        setTxid(txid)

        toast({
          description: "Your unlock has been broadcast."
        });

        setIsLoading(false)
      } else {
        throw Error("No txid returned, broadcast failed.")
      }

    } catch (error) {
      console.error('Error broadcasting transaction:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive", // adjust based on your toast library's API
      });
      setIsLoading(false)
    }
  };

  return (
    <Shell>
      <DashboardHeader heading="Broadcast" text="Use the offline unlocker and broadcast unlocking transaction.">
        <Button variant="secondary">
          
            <Icons.download className="mr-2 h-3 w-3" />
            <a href="/unlocker.zip" download>
              Unlocker
            </a>
        </Button>
      </DashboardHeader>

      <form>
        <Card>
          <CardHeader>
            <CardTitle>Unlocked Raw Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Textarea
                id="name"
                placeholder=""
                className="col-span-1"
                onChange={(e) => setBase64Result(e.target.value)}
                autoComplete="off"
                required
                rows={8} // Set the number of rows as needed
              ></Textarea>

            </div>
          </CardContent>
          <CardFooter>
            {isLoading ? (
              <Button variant="outline" disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Broadcast
              </Button>
            ) : (
              <Button variant="outline" type="submit" onClick={() => handleSubmit(base64Result)}>Broadcast</Button>
            )}
            {txid ? (
              <div className="flex items-center justify-center ml-4">
                <Button variant="secondary">
                  <a className="hover:underline" href={"https://whatsonchain.com/tx/" + txid} target="_blank" rel="noopener noreferrer">
                    {txid.toString().slice(0, 8) + "..." + txid.toString().slice(-8)}
                  </a>
                </Button>
              </div>
            ) : null}
          </CardFooter>
        </Card>
      </form>

    </Shell>
  )
}
