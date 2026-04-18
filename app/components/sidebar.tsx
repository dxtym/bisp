import { cn } from "@/lib/utils"
import { LuBookOpen } from "react-icons/lu"
import Conversation from "@/components/conversation"

interface SidebarProps {
  className?: string
  style?: React.CSSProperties
}

export default function Sidebar({ className, style }: SidebarProps) {
  return (
    <div style={style} className={cn("relative overflow-hidden bg-muted/30 text-foreground flex flex-col h-screen p-10", className)}>
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
