"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { selectConversations, setConversation } from "@/lib/store/slices/conversation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { LuMessageSquare } from "react-icons/lu"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchDialog({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch()
  const conversations = useAppSelector(selectConversations)

  const handleSelect = (id: string) => {
    const c = conversations.find((c) => c.id === id)
    if (c) dispatch(setConversation(c))
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Suhbat qidiring..." />
      <CommandList>
        <CommandEmpty>Topilmadi</CommandEmpty>
        <CommandGroup heading="Suhbatlar">
          {conversations.map((c) => (
            <CommandItem
              key={c.id}
              value={c.title}
              onSelect={() => handleSelect(c.id)}
              className={cn("hover:bg-transparent cursor-pointer", "data-[selected=true]:bg-transparent data-[selected=true]:text-foreground")}
            >
              <LuMessageSquare className="size-4 shrink-0" />
              {c.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
