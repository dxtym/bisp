import ChatPage from "@/pages/chat/chat";
import SchemaPage from "@/pages/schema/schema";

import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="grid h-screen grid-cols-[1fr_auto_2fr_auto_1fr]">
      <span></span>
      <Separator orientation="vertical" />
      <ChatPage />
      <Separator orientation="vertical" />
      <SchemaPage />
    </div>
  );
}
