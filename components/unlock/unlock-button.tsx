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
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"



interface UnlockButtonProps extends ButtonProps { }

function base64ToHex(base64: string) {
    const raw = atob(base64);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
}


export function UnlockButton({
    className,
    variant,
    ...props
}: UnlockButtonProps) {

    const [base64Result, setBase64Result] = useState<string | undefined>()

    const handleSubmit = async (base64Result: string | undefined) => {
        
        if (!base64Result) {
            console.error("No result to process");
            return;
        }

        try {
            const hexResult = base64ToHex(base64Result);

            // Broadcasting the transaction
            const response = await fetch('https://api.taal.com/api/v1/broadcast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rawtx: hexResult })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            // Handle response here
            console.log('Transaction broadcasted:', responseData);
        } catch (error) {
            console.error('Error broadcasting transaction:', error);
        }
    };

    return (
        <>

            {/* Add Alert */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary">Broadcast</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Unlock a transaction</DialogTitle>
                        <DialogDescription>
                            Broadcast the unlocked transaction.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Name Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                QR Text
                            </Label>
                            <Textarea
                                id="name"
                                placeholder="Enter QR text"
                                className="col-span-3"
                                onChange={(e) => setBase64Result(e.target.value)}
                                autoComplete="off"
                                required
                                rows={4} // Set the number of rows as needed
                            ></Textarea>
                        </div>

                    </div>



                    <DialogFooter>
                        <Button variant="outline" type="submit" onClick={() => handleSubmit(base64Result)}>Broadcast</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
