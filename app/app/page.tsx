import Sidebar from "@/components/sidebar";
import Chat from "@/components/chat";
import Panel from "@/components/panel";

import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="grid h-screen grid-cols-[300px_auto_3fr_auto_450px]">
      <Sidebar />
      <Separator orientation="vertical" />
      <Chat />
      <Separator orientation="vertical" />
      <Panel />
    </div>
  );
}
