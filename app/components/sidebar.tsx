import { LuBookOpen } from "react-icons/lu"
import Conversation from "@/components/conversation"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <div className={`relative overflow-hidden bg-muted/30 text-foreground flex flex-col h-screen p-10 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <LuBookOpen className="size-5" />
        <span className="font-semibold text-lg">Kutoob</span>
      </div>
      <div className="flex-1 flex items-center">
        <Conversation />
      </div>
    </div>
  )
}
