"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"
import { useQRCode } from 'next-qrcode';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Loading from "@/app/(frontpage)/loading";
import Link from "next/link";
import { toast } from "../ui/use-toast";


interface StreamUnlockButtonProps extends ButtonProps {
    txid: string
    value: number
    output: number
    script: string
}

export function StreamUnlockButton({
    txid,
    value,
    output,
    script,
    className,
    variant,
}: StreamUnlockButtonProps) {
    const { Canvas } = useQRCode();

    const [unlockUTXOInfo, setUnlockUTXOInfo] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getUnlockUTXOInfo = async (txid: string, value: number, output: number, script: string) => {
            setLoading(true)
            // Helper function to convert hex string to byte array
            function hexToBytes(hexString: string) {
                const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
                for (let i = 0, j = 0; i < hexString.length; i += 2, j++) {
                    bytes[j] = parseInt(hexString.substr(i, 2), 16);
                }
                return bytes;
            }

            // Helper function to convert byte array to Base64 string
            function bytesToBase64(byteArray: Uint8Array | number[]): string {
                const numberArray = byteArray instanceof Uint8Array ? Array.from(byteArray) : byteArray;
                const binaryString = String.fromCharCode.apply(null, numberArray);
                return window.btoa(binaryString);
            }

            // Convert hex to byte array
            const byteArray = hexToBytes(script);

            // Convert byte array to Base64
            const base64Script = bytesToBase64(byteArray);

            const utxo = {
                txid: txid,
                vout: output,
                satoshis: value * 100000000,
                script: base64Script
            };

            const utxoString = JSON.stringify(utxo)
            
            setUnlockUTXOInfo(utxoString)
            setLoading(false)
        }

        getUnlockUTXOInfo(txid, value, output, script)
    }, [])

    const copyCode = () => {
        if (unlockUTXOInfo) {
            navigator.clipboard.writeText(unlockUTXOInfo)
                .then(() => {
                    console.log(unlockUTXOInfo)
                    toast({
                        description: "Unlock code copied to clipboard."
                      });
                })
                .catch(err => {
                    console.error('Error in copying text: ', err);
                    toast({
                        title: "Error",
                        description: "Failed to copy unlock code.",
                        variant: "destructive", // adjust based on your toast library's API
                      });
                });
        }
    };

    return (
        <>

            {/* Add Alert */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Unlock</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Unlock Output</DialogTitle>
                        <DialogDescription>
                            Scan this QR Code on the offline unlocker.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {loading ? <Loading /> : unlockUTXOInfo ? (
                            <Canvas
                                text={unlockUTXOInfo}
                                options={{
                                    errorCorrectionLevel: 'L',
                                    margin: 3,
                                    scale: 4,
                                    width: 380,
                                    color: {
                                        dark: '#000000',
                                        light: '#FFFFFF',
                                    },
                                }}
                            />
                        ) : null}
                    </div>


                    <DialogFooter>
                        <Button variant="outline" onClick={() => copyCode()}>Copy Code</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
