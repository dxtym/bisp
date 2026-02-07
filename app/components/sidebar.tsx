"use client"

import Image from "next/image"
import { useState } from "react"

import { Home, DollarSign, User, Settings, Plus, Sun, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { useClerk } from "@clerk/nextjs";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { setActiveConversationId, createConversation } from "@/lib/store/slices/conversationSlice"

const navigationItems = [
  { name: "Asosiy", icon: Home, href: "/" },
  { name: "Narxlar", icon: DollarSign, href: "/pricing" },
  { name: "Profil", icon: User, href: "/profile" },
  { name: "Sozlamalar", icon: Settings, href: "/settings" },
]

export default function Sidebar() {
  const clerk = useClerk();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const dispatch = useAppDispatch();
  const conversations = useAppSelector((state) => state.conversation.conversations);
  const activeConversationId = useAppSelector((state) => state.conversation.activeConversationId);
  const isLoading = useAppSelector((state) => state.conversation.isLoading);

  const handleCreateConversation = async () => {
    const userId = clerk.user?.id;
    if (!userId) return;
    dispatch(createConversation({ userId, title: "Yangi suhbat" }));
  };

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setActiveConversationId(conversationId));
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex h-10 pl-2 items-center">
        <Image src="/logo.png" alt="Logo" width={50} height={50} className="h-6 w-6" />
      </div>
      <Separator className="my-2" />
      <div className="my-2 px-2 text-sm text-muted-foreground">Bo&lsquo;limlar</div>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={handleCreateConversation}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {isLoading && conversations.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              Yuklanmoqda...
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              Suhbatlar mavjud emas.
            </div>
          ) : (
            conversations.map((conversation) => (
              <Button
                key={conversation.conversationId}
                variant={activeConversationId === conversation.conversationId ? "secondary" : "ghost"}
                className="h-auto w-full justify-start py-2 text-left"
                onClick={() => handleSelectConversation(conversation.conversationId)}
              >
                <span className="truncate text-sm font-normal">
                  {conversation.title || "Nomsiz suhbat"}
                </span>
              </Button>
            ))
          )}
        </ScrollArea>
      </div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent asChild>
          <div className="left-4 right-4 bottom-20 bg-popover text-popover-foreground rounded-md p-4 shadow-lg">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm text-muted-foreground">Ilova rangi</div>
              <ToggleGroup variant="outline" type="single" defaultValue={theme} >
                <ToggleGroupItem value="light"><Sun className="inline-block mr-1 h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="dark"><Moon className="inline-block mr-1 h-4 w-4" /></ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={() => clerk.signOut()} className="w-full py-2 bg-black text-white rounded-md text-sm text-center">Chiqish</button>
            </div>
          </div>
        </CollapsibleContent>
        <div className="border-t pt-4">
          <CollapsibleTrigger asChild>
            <button className="w-full text-left">
              <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 w-full">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{clerk.user?.fullName ?? "Guest"}</span>
                  <span className="text-xs text-muted-foreground truncate">{clerk.user?.emailAddresses?.at(0)?.emailAddress ?? "guest@email.com"}</span>
                </div>
              </div>
            </button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  )
}
