"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

import { WalletContext } from '@/app/context/WalletContextProvider'
import bsv from 'bsv';
import { getLockupScript } from "@/lib/scrypt"
import { updateLockstreamDetails } from "@/app/actions"
import { Lockstream } from "@prisma/client"


interface FundStreamButtonProps extends ButtonProps {
    lockstream: Lockstream
}

export function FundStreamButton({
    lockstream,
    className,
    variant,
    ...props
}: FundStreamButtonProps) {
    const router = useRouter()

    const { identityPubKey, bsvAddress, sendBsv } = useContext(WalletContext)!;

    const [xPub, setXPub] = useState("")
    const [addressData, setAddressData] = useState<{ address: string; pubkey: string }[]>([]);
    const [selectedPubKey, setSelectedPubKey] = useState("");

    const handleAddressChange = (selectedAddress: string) => {
        const selectedData = addressData.find(data => data.address === selectedAddress);
        if (selectedData) {
            setSelectedPubKey(selectedData.pubkey);
        }
    };

    useEffect(() => {
        const xPubRegex = /^xpub[a-zA-Z0-9]{107,108}$/;

        if (xPubRegex.test(xPub)) {
            const hdPublicKey = bsv.HDPublicKey.fromString(xPub);
            const newAddressData = [];
            for (let i = 0; i < 10; i++) {
                const path = `m/0/${i}`;
                const child = hdPublicKey.deriveChild(path);
                const pubkey = child.publicKey;
                newAddressData.push({
                    address: pubkey.toAddress().toString(),
                    pubkey: pubkey.toString(),
                });
            }
            setAddressData(newAddressData);
        } else {
            setAddressData([]);
        }
    }, [xPub]);

    const handleSubmit = async () => {


        console.log(identityPubKey)
        console.log(bsvAddress)
    
        if (identityPubKey && bsvAddress) {
            // Assuming startDate and endDate are in Unix timestamp format (milliseconds)
            const startDate =lockstream.startDate;
            const endDate = lockstream.endDate;

            let scriptCount = 0; // Initialize a counter
            const paymentParams = [];

            // Iterate through each day between startDate and endDate
            for (let day = Number(startDate); day <= endDate; day += 86400) { // Increment by 86400 seconds (1 day)
                console.log(day);
                const lockupScript = await getLockupScript(Number(day), selectedPubKey);
                
                scriptCount++; // Increment the counter for each script generated

                paymentParams.push({
                    script: lockupScript,
                    satoshis: Number(lockstream.satoshisUnlockedPerDay),
                });
            }

            try {
                const broadcast = await sendBsv(paymentParams);
                
                if (broadcast) {
                    const updatedLockstream = await updateLockstreamDetails(lockstream.id, identityPubKey, broadcast.txid, selectedPubKey, bsvAddress, true)
                    console.log(updatedLockstream)
                    toast({
                        description: "Your lockstream has been funded."
                      });
                    router.push("/dashboard/streams")
                }                
                
            } catch (err) {
                console.log(err);
            }

            console.log(`Total lockup scripts generated: ${scriptCount}`);
        };

    };

    return (
        <>

            {/* Add Alert */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Fund</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Fund Stream</DialogTitle>
                        <DialogDescription>
                            Enter your xpub and select the address to fund.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Name Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                xpub
                            </Label>
                            <Input
                                id="name"
                                placeholder="xpub"
                                className="col-span-3"
                                onChange={(e) => setXPub(e.target.value)}
                                autoComplete="off"
                                required
                            />
                        </div>
                        {/* Address Dropdown using shadcn's Select component */}
                        {addressData.length > 0 && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">
                                    Address
                                </Label>
                                <div className="col-span-3">
                                    <Select onValueChange={handleAddressChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Address" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {addressData.map((data, index) => (
                                                <SelectItem key={index} value={data.address}>
                                                    {data.address}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmit}>Fund</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
