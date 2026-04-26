"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  fetchConversations,
  selectConversations,
  selectConversation,
  selectIsLoading,
  selectPinnedConversations,
  selectUnpinnedConversations,
  setConversation,
  createConversation,
  removeConversation,
  updateConversationTitle,
  togglePin,
} from "@/lib/store/slices/conversation";
import type { IConversation } from "@/lib/mongodb/models/conversation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import MenuItem from "@/components/menu-item";
import Profile from "@/components/profile";
import Header from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const { data: session } = useSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const pinned = useAppSelector(selectPinnedConversations);
  const unpinned = useAppSelector(selectUnpinnedConversations);
  const conversation = useAppSelector(selectConversation);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (session?.user?.id) dispatch(fetchConversations(session.user.id));
  }, [session, dispatch]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(removeConversation(id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleTitleSave = async (conversationId: string, title: string): Promise<void> => {
    await dispatch(updateConversationTitle({ conversationId, title })).unwrap();
  };

  const handleTogglePin = (conversationId: string, isPinned: boolean) => {
    dispatch(togglePin({ conversationId, isPinned }));
  };

  const renderItem = (c: IConversation) => (
    <MenuItem
      key={c.id}
      c={c}
      isActive={c.id === conversation?.id}
      isDeleting={deletingId === c.id}
      onSelect={() => dispatch(setConversation(c))}
      onDelete={handleDelete}
      onTitleSave={handleTitleSave}
      onTogglePin={handleTogglePin}
    />
  );

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
        {isLoading ? (
          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className="flex w-full items-center gap-2 rounded-sm py-0.5">
                  <Skeleton className="h-4 flex-1 rounded-sm py-4" />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : conversations.length === 0 ? (
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">
            Suhbatlar mavjud emas.
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <SidebarGroup className="p-0">
                <SidebarGroupLabel className="text-base">Arxiv</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>{pinned.map(renderItem)}</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="text-base">Suhbatlar</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{unpinned.map(renderItem)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </Sidebar>
  );
}
