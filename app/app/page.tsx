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
        <SidebarInset>
          <div className="absolute top-4 left-4 z-10">
            <SidebarTrigger />
          </div>
            <div className="flex flex-1">
            <div className="flex-2 overflow-y-auto">
              <Chat />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-1 overflow-y-auto">
              <Panel />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  )
}
