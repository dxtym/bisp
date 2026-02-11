"use client"

import { useEffect } from "react"
import { Plus } from "lucide-react"

import { useUser } from "@clerk/nextjs"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import {
  fetchConversations,
  selectConversations,
  selectConversation,
  setConversation,
  createConversation
} from "@/lib/store/slices/conversation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Profile from "@/components/profile"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"

export default function Menu() {
  const { user } = useUser()

  const dispatch = useAppDispatch()
  const conversations = useAppSelector(selectConversations)
  const conversation = useAppSelector(selectConversation)

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations(user.id))
    }
  }, [user, dispatch])

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Suhbatlar</p>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 rounded-full"
            onClick={() => {
              if (!user) return
              dispatch(createConversation({ userId: user.id, title: "Yangi suhbat" }))
            }}
          >
            <Plus />
          </Button>
        </div>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {conversations.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              Suhbatlar mavjud emas.
            </div>
          ) : (
            conversations.map((c) => (
              <SidebarMenuItem key={c.id}>
                <SidebarMenuButton
                  className="rounded-sm"
                  isActive={c.id === conversation?.id}
                  onClick={() => dispatch(setConversation(c))}
                >
                  <p className="text-sm truncate">{c.title}</p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </Sidebar>
  )
}
