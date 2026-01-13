import ChatPage from "@/pages/chat/chat";
import SchemaPage from "@/pages/schema/schema";

import { Separator } from "@/components/ui/separator";
import SidebarPage from "@/pages/sidebar/sidebar";

export default function Home() {
  return (
    <div className="grid h-screen grid-cols-[300px_auto_3fr_auto_450px]">
      <SidebarPage />
      <Separator orientation="vertical" />
      <ChatPage />
      <Separator orientation="vertical" />
      <SchemaPage />
    </div>
  );
}
