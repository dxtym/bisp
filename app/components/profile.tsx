"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LucideLogOut } from "lucide-react"

export default function Profile() {
  const { data: session } = useSession()

  return (
    <div className="py-2">
      <div className="flex items-center justify-between rounded-sm bg-muted border border-neutral-700 px-2 py-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium truncate">
            {session?.user?.name ?? "Guest"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            Free
          </span>
        </div>
        <Button
          size="sm"
          className="w-0"
          variant="secondary"
          onClick={() => signOut()}
        >
          <LucideLogOut />
        </Button>
      </div>
    </div>
  )
}
