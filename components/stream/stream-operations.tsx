"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"


import { Button } from "@/components/ui/button"
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Lockstream } from "@prisma/client"
import { Label } from "../ui/label"
import { Input } from "../ui/input"


import { updateLockstreamName } from "@/app/actions"
import { deleteLockstream } from "@/app/actions"


async function changeNameStream(streamId: string, identityPubKey: string, newName: string) {
  try {
    
    // Directly call the server action
    const updatedLockstream = await updateLockstreamName(streamId, identityPubKey, newName);

    if (updatedLockstream) {
      return true;
    } else {
      throw new Error('Lockstream update failed');
    }
  } catch (error) {
    console.error("Error changing stream name:", error);
    toast({
      title: "Something went wrong.",
      description: "Your stream name was not changed. Please try again.",
      variant: "destructive",
    });
  }
}

async function deleteStream(streamId: string, identityPubKey: string) {
  try {
    
    // Directly call the server action
    const deletedLockstream = await deleteLockstream(streamId, identityPubKey);

    if (deletedLockstream) {
      toast({
        description: "Your lockstream has been deleted.",
      });
      return true;
    } else {
      throw new Error('Lockstream update failed');
    }
  } catch (error) {
    console.error("Error changing stream name:", error);
    toast({
      title: "Something went wrong.",
      description: "Your lockstream was not deleted. Please try again.",
      variant: "destructive",
    });
  }
}

interface ActivityOperationsProps {
  lockstream: Lockstream,
  identityPubKey: string
}

export function ActivityOperations({
  lockstream,
  identityPubKey
}: ActivityOperationsProps) {
  const router = useRouter()
  
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
  const [showLogAlert, setShowLogAlert] = useState<boolean>(false)
  const [showDropDown, setShowDropDown] = useState<boolean>(false)

  const [streamName, setStreamName] = useState("")


  return (
    <>
      <DropdownMenu open={showDropDown} onOpenChange={setShowDropDown}>
        <DropdownMenuTrigger>

          <div className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
            <Icons.ellipsis className="h-4 w-4" />
            <span className="sr-only">Open</span>
          </div>

        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => {
              setShowLogAlert(true)
              setShowDropDown(false)
            }}
          >
            <Icons.settings className="mr-2 h-4 w-4" />
            Change Name
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex cursor-pointer items-center text-red-600 focus:text-red-600"
            onSelect={() => {
              setShowDeleteAlert(true)
              setShowDropDown(false)
            }}
          >
            <Icons.trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Alert */}
      <Credenza open={showLogAlert} onOpenChange={setShowLogAlert}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Change Lockstream Name</CredenzaTitle>
            <CredenzaDescription>
              This will change the name of the lockstream.
            </CredenzaDescription>
          </CredenzaHeader>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="daily spending"
                className="col-span-3"
                onChange={(e) => setStreamName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>
          <CredenzaFooter className="flex flex-col-reverse">
            <CredenzaClose asChild>
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
            <Button
              onClick={async (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => {
                event.preventDefault()
                setIsDeleteLoading(true)
                
                const updated = await changeNameStream(lockstream.id, identityPubKey, streamName)
                console.log(updated)

                setIsDeleteLoading(false)

                if (updated) {
                  router.push("/dashboard/streams/" + lockstream.id)
                }

              }}
              disabled={isDeleteLoading}
              className="bg-orange-600 focus:ring-orange-700"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.settings className="mr-2 h-4 w-4" />
              )}
              <span>Update</span>
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>

      {/* Delete Alert */}
      <Credenza open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>
              Are you sure you want to delete this lock stream?
            </CredenzaTitle>
            <CredenzaDescription>
              This action cannot be undone.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaFooter className="flex flex-col-reverse">
            <CredenzaClose asChild>
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
            <Button
              onClick={async (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                if (identityPubKey) {
                  const deletedStream = await deleteStream(lockstream.id, identityPubKey)

                  if (deletedStream) {
                    setShowDeleteAlert(false)
                    setIsDeleteLoading(false)

                    toast({
                      title: "Deleted",
                      description: "Your lockstream has been deleted.",
                      variant: "destructive", // adjust based on your toast library's API
                    });

                    router.refresh()
                  }
                } else {
                  toast({
                    title: "Error",
                    description: "Please sign in with Panda Wallet.",
                    variant: "destructive", // adjust based on your toast library's API
                  });
                }

                

              }}
              disabled={isDeleteLoading}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  )
}
