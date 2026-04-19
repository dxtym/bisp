"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import Image from "next/image"
import { LuLogOut, LuSparkles, LuSun, LuMoon, LuSearch, LuUsers } from "react-icons/lu"

export default function Profile() {
  const { data: session } = useSession()
  const { resolvedTheme, setTheme } = useTheme()
  const [queriesCount, setQueriesCount] = useState<number>(0)

  useEffect(() => {
    fetch("/api/user/queries")
      .then((res) => res.json())
      .then((data) => setQueriesCount(data.data?.queriesCount ?? 0))
      .catch(console.error)
  }, [])

  return (
    <div className="py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex w-full justify-between cursor-pointer items-center gap-3 rounded-sm bg-muted/50 border px-2 py-2 hover:bg-muted/80 transition-colors">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {session?.user?.name ?? "Guest"}
              </span>
              <span className={`text-xs truncate ${queriesCount === 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {`So'rovlar: ${queriesCount} / 5`}
              </span>
            </div>
            <div className="size-8 rounded-full overflow-hidden bg-muted flex items-center justify-center text-sm font-medium ring-2 ring-neutral-300 ring-offset-1 ring-offset-white dark:ring-white/20 dark:ring-offset-black">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <span>{session?.user?.name?.[0]?.toUpperCase() ?? "G"}</span>
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-[var(--radix-dropdown-menu-trigger-width)]">
          <DropdownMenuItem asChild>
            <Link href="/search" className="flex items-center gap-2">
              <LuSearch className="h-4 w-4" />
              Qidiruv
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="flex items-center gap-2">
              <LuSparkles className="h-4 w-4" />
              Tariflar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2"
          >
            {resolvedTheme === "dark" ? (
              <LuSun className="h-4 w-4" />
            ) : (
              <LuMoon className="h-4 w-4" />
            )}
            {resolvedTheme === "dark" ? "Kunduzgi" : "Tungi"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {session?.user?.role === "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin/users" className="flex items-center gap-2">
                  <LuUsers className="h-4 w-4" />
                  Foydalanuvchilar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            onClick={() => signOut()}
            className="flex items-center gap-2"
          >
            <LuLogOut className="h-4 w-4" />
            Chiqish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
