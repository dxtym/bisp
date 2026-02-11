"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { LucideLogOut } from "lucide-react"

export default function Profile() {
  const clerk = useClerk()
  const { user } = useUser()

  return (
    <div className="border-t pt-3">
      <div className="flex items-center justify-between rounded-sm bg-muted border border-neutral-700 px-2 py-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium truncate">
            {user?.firstName ?? "Guest"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            Free
          </span>
        </div>
        <Button
          size="sm"
          className="w-0"
          variant="secondary"
          onClick={() => clerk.signOut()}
        >
          <LucideLogOut />
        </Button>
      </div>
    </div>
  )
}
