"use client"

import Menu from "@/components/menu"
import Chat from "@/components/chat"

import { StoreProvider } from "@/lib/store/provider"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Panel from "@/components/panel"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <StoreProvider>
      <SidebarProvider defaultOpen={true}>
        <Menu />
        <div className="flex flex-1">
          <Separator orientation="vertical" />
          <div className="flex-3 overflow-y-auto">
            <Chat />
          </div>
          <Separator orientation="vertical" />
          <div className="flex-1 overflow-y-auto">
            <Panel />
          </div>
        </div>
      </SidebarProvider>
    </StoreProvider>
  )
}
