"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  fetchConversations,
  selectConversations,
  selectConversation,
  selectIsLoading,
  setConversation,
  createConversation,
  removeConversation,
  updateConversationTitle
} from "@/lib/store/slices/conversation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LuTrash2 } from "react-icons/lu";
import { cn } from "@/lib/utils";
import Title from "@/components/title";
import Profile from "@/components/profile";
import Header from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemProps {
  c: { id: string; title: string }
  isActive: boolean
  isDeleting: boolean
  onSelect: () => void
  onDelete: (id: string) => void
  onTitleSave: (id: string, title: string) => Promise<void>
}

function Item({ c, isActive, isDeleting, onSelect, onDelete, onTitleSave }: ItemProps) {
  return (
    <SidebarMenuItem key={c.id}>
      <div
        className={cn(
          "group/item flex w-full items-center gap-2 rounded-sm py-1 px-3 text-sm transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
          isDeleting && "opacity-50 pointer-events-none animate-pulse"
        )}
      >
        <div
          className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer"
          onClick={onSelect}
        >
          <Title
            title={c.title}
            onSave={(title) => onTitleSave(c.id, title)}
            isActive={isActive}
            disabled={isDeleting}
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 shrink-0 transition-all duration-200",
            "opacity-0 group-hover/item:opacity-100",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            "focus-visible:ring-2 ring-destructive/20",
            isDeleting && "opacity-50"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(c.id);
          }}
          disabled={isDeleting}
        >
          <LuTrash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </SidebarMenuItem>
  )
}

export default function Menu() {
  const { data: session } = useSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const conversation = useAppSelector(selectConversation);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchConversations(session.user.id));
    }
  }, [session, dispatch]);

  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(removeConversation(id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleTitleSave = async (conversationId: string, title: string) => {
    await dispatch(updateConversationTitle({ conversationId, title }));
  };

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <Header
          onCreate={() => {
            if (!session?.user?.id) return;
            dispatch(createConversation({ userId: session.user.id, title: "Yangi suhbat" }));
          }}
        />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className="flex w-full items-center gap-2 rounded-sm py-0.5">
                  <Skeleton className="h-4 flex-1 rounded-sm py-4" />
                </div>
              </SidebarMenuItem>
            ))
          ) : conversations.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              Suhbatlar mavjud emas.
            </div>
          ) : (
            conversations.map((c) => (
              <Item
                key={c.id}
                c={c}
                isActive={c.id === conversation?.id}
                isDeleting={deletingId === c.id}
                onSelect={() => dispatch(setConversation(c))}
                onDelete={handleDeleteClick}
                onTitleSave={handleTitleSave}
              />
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </Sidebar>
  )
}
