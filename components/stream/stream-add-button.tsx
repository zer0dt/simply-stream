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

interface ActivityAddButtonProps extends ButtonProps { }

const combineDateAndTime = (dateString: string, timeString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);

  // Create a new date object with both date and time
  const combined = new Date(year, month - 1, day, hours, minutes);
  return Math.floor(combined.getTime() / 1000); // Convert to Unix timestamp in seconds
};


export function ActivityAddButton({
  className,
  variant,
  ...props
}: ActivityAddButtonProps) {
  const router = useRouter()
  const { identityPubKey } = useContext(WalletContext)!;

  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unlockTime, setUnlockTime] = useState("")
  const [bitcoinToLock, setBitcoinToLock] = useState(0);
  const [bitcoinUnlockedPerDay, setBitcoinUnlockedPerDay] = useState(0);

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    // Ensure all fields have values before calculating
    if (bitcoinToLock && startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (start && end && end >= start) {
        const totalDays = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1;
        console.log(totalDays)
        const unlockedPerDay = bitcoinToLock / totalDays;
        console.log(unlockedPerDay)
        setBitcoinUnlockedPerDay(unlockedPerDay); // Assuming bitcoinToLock is a valid number
      } else {
        setBitcoinUnlockedPerDay(0);
      }
    } else {
      setBitcoinUnlockedPerDay(0);
    }
  }, [bitcoinToLock, startDate, endDate]);

  const handleSubmit = async () => {

    setLoading(true)

    if (identityPubKey) {
      console.log(identityPubKey);
      // 02a45894d4cc9424f779e4403f751cdce383d52a18b2f48fdf6467c097e5cdfc05

        // Check if all required fields are filled
      if (!name || !startDate || !endDate || !bitcoinToLock) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive", // adjust based on your toast library's API
        });
        return;
      }

      const startTimestamp = combineDateAndTime(startDate, unlockTime);
      const endTimestamp = combineDateAndTime(endDate, unlockTime);

      const lockstreamData = {
        userId: identityPubKey, // Use the public key as userId
        name,
        startDate: startTimestamp,
        endDate: endTimestamp,
        unlockTime,
        totalSatoshisLocked: Math.round(bitcoinToLock * 100000000),
        satoshisUnlockedPerDay: Math.round(bitcoinUnlockedPerDay * 100000000),
      };

      const newLockstream = await createNewLockstream(lockstreamData);
      console.log('Lockstream created:', newLockstream);

      router.push(`/dashboard/streams/${newLockstream.id}`)
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: "Please sign in with Panda Wallet.",
        variant: "destructive", // adjust based on your toast library's API
      });
      setLoading(false)   
    }
     
  };

  return (
    <>

      {/* Add Alert */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Create Stream</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Lock Stream</DialogTitle>
            <DialogDescription>
              Add an unfunded lock stream to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter lockstream name"
                className="col-span-3"
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            {/* Start Date Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                type="date"
                id="startDate"
                className="col-span-3"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* End Date Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                type="date"
                id="endDate"
                className="col-span-3"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            {/* Time to Unlock Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unlockTime" className="text-right">
                Time to Unlock
              </Label>
              <Input
                type="time"
                id="unlockTime"
                className="col-span-3"
                onChange={(e) => setUnlockTime(e.target.value)}
                required
              />
            </div>

            {/* Bitcoin to Lock Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bitcoinToLock" className="text-right">
                Bitcoin to Lock
              </Label>
              <Input
                type="number"
                id="bitcoinToLock"
                value={bitcoinToLock}
                onChange={(e) => setBitcoinToLock(e.target.value)}
                placeholder="Enter Bitcoin amount"
                className="col-span-3"
                required
              />
            </div>

            {/* Display Bitcoin Unlocked Per Day */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Unlocked Per Day
              </Label>
              <div className="col-span-3">
                {bitcoinUnlockedPerDay} bitcoin / day
              </div>
            </div>

          </div>

          <DialogFooter>
            {loading ? (
              <Button variant="outline" disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Create
            </Button>
            ) : (
              <Button variant="outline" type="submit" onClick={handleSubmit}>Create</Button>
            )}            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
