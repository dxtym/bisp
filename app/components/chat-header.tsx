"use client";

import { useState } from "react";
import { LuPin, LuPinOff, LuShare2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectConversation, togglePin } from "@/lib/store/slices/conversation";
import { cn } from "@/lib/utils";
import ShareDialog from "@/components/share-dialog";

export default function ChatHeader() {
  const dispatch = useAppDispatch();
  const conversation = useAppSelector(selectConversation);
  const [shareOpen, setShareOpen] = useState(false);

  const isPinned = !!conversation?.isPinned;

  const handleTogglePin = () => {
    if (!conversation) return;
    dispatch(togglePin({ conversationId: conversation.id, isPinned: !isPinned }));
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3 border-b">
      <div className="flex items-center gap-4 min-w-0">
        <SidebarTrigger />
        {conversation && (
          <span className="text-lg font-medium truncate">{conversation.title}</span>
        )}
      </div>
      {conversation && (
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className={cn("h-8 w-8 p-0", isPinned && "text-foreground")}
            onClick={handleTogglePin}
            aria-label={isPinned ? "Arxivdan olib tashlash" : "Arxivga qo'shish"}
          >
            {isPinned ? <LuPinOff className="h-4 w-4" /> : <LuPin className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setShareOpen(true)}
            aria-label="Ulashish"
          >
            <LuShare2 className="h-4 w-4" />
          </Button>
          <ShareDialog
            open={shareOpen}
            onOpenChange={setShareOpen}
            conversationId={conversation.id}
            shareToken={conversation.shareToken}
          />
        </div>
      )}
    </div>
  );
}
