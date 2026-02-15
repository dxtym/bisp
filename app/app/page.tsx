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
        <SidebarInset className="flex flex-col h-[calc(100svh-1rem)] overflow-hidden">
          <div className="flex flex-1 h-full">
            <div className="flex-2 overflow-y-auto">
              <div className="p-3 border-b">
                <SidebarTrigger />
              </div>
              <div className="h-[calc(100vh-1rem-3.5rem)]">
                <Chat />
              </div>
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
