"use client"

import Sidebar from "@/components/sidebar";
import Chat from "@/components/chat";
import Panel from "@/components/panel";

import { Separator } from "@/components/ui/separator";
import { StoreProvider } from "@/lib/store/provider";
import { ConversationInit } from "@/lib/store/conversation-init";

export default function Home() {
  return (
    <StoreProvider>
      <ConversationInit />
      <div className="grid h-screen grid-cols-[300px_auto_3fr_auto_450px]">
        <Sidebar />
        <Separator orientation="vertical" />
        <Chat />
        <Separator orientation="vertical" />
        <Panel />
      </div>
    </StoreProvider>
  );
}
