import Image from "next/image"

import { Home, DollarSign, User, Settings, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const navigationItems = [
  { name: "Asosiy", icon: Home, href: "/" },
  { name: "Narxlar", icon: DollarSign, href: "/pricing" },
  { name: "Profil", icon: User, href: "/profile" },
  { name: "Sozlamalar", icon: Settings, href: "/settings" },
]

const conversations = [
  { title: "Project Discussion" },
  { title: "API Integration Help" },
  { title: "Database Schema Review" },
  { title: "UI Component Ideas" },
  { title: "Performance Optimization" },
]

export default function Sidebar() {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex h-10 pl-2 items-center">
        <Image src="/favicon.ico" alt="Logo" width={24} height={24} className="h-6 w-6" />
      </div>
      <Separator className="my-2" />
      <div className="my-2 px-2 text-sm text-muted-foreground">Bo’limlar</div>
      {navigationItems.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          className="w-full justify-start font-normal"
        >
          <item.icon className="mr-2 h-3 w-3" />
          {item.name}
        </Button>
      ))}
      <Separator className="my-2" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="my-2 flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">Suhbatlar</div>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((conversation) => (
            <Button
              key={conversation.title}
              variant="ghost"
              className="h-auto w-full justify-start py-2 text-left"
            >
              <span className="truncate text-sm font-normal">
                {conversation.title}
              </span>
            </Button>
          ))}
        </ScrollArea>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <User className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Dilmurod Abdusamadov</span>
            <span className="text-xs text-muted-foreground">dabdusamadov@wiut.uz</span>
          </div>
        </div>
      </div>
    </div>
  )
}
