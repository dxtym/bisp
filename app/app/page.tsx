"use client";

import { useSession } from "next-auth/react";
import Main from "@/components/main";
import Chat from "@/components/chat";
import Menu from "@/components/menu";
import Panel from "@/components/panel";
import { Provider } from "@/components/providers/store";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!session) {
    return <Main />;
  }

  return (
    <Provider>
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
    </Provider>
  );
}
