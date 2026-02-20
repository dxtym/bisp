"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  fetchConversations,
  selectConversations,
  selectConversation,
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
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Title from "@/components/title";
import Profile from "@/components/profile";
import Header from "@/components/header";
import Modal from "@/components/modal";

export default function Menu() {
  const { user } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [conversationToDelete, setConversationToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const conversation = useAppSelector(selectConversation);

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations(user.id));
    }
  }, [user, dispatch]);

  const handleDeleteClick = (id: string, title: string) => {
    setConversationToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;

    setDeletingId(conversationToDelete.id);
    try {
      await dispatch(removeConversation(conversationToDelete.id));
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTitleSave = async (conversationId: string, title: string) => {
    await dispatch(updateConversationTitle({ conversationId, title }));
  };

  return (
    <>
      <Sidebar variant="inset" collapsible="offcanvas">
        <SidebarHeader>
          <Header
            onCreate={() => {
              if (!user) return;
              dispatch(createConversation({ userId: user.id, title: "Yangi suhbat" }));
            }}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {conversations.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                Suhbatlar mavjud emas.
              </div>
            ) : (
              conversations.map((c) => (
                <SidebarMenuItem key={c.id}>
                  <div
                    className={cn(
                      "group relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "focus-visible:ring-2 ring-sidebar-ring",
                      c.id === conversation?.id && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                      deletingId === c.id && "opacity-50 pointer-events-none animate-pulse"
                    )}
                  >
                    <div
                      className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer"
                      onClick={() => dispatch(setConversation(c))}
                    >
                      <Title
                        title={c.title}
                        onSave={(title) => handleTitleSave(c.id, title)}
                        isActive={c.id === conversation?.id}
                        disabled={deletingId === c.id}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-6 w-6 p-0 shrink-0 transition-all duration-200",
                        "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                        "focus-visible:ring-2 ring-destructive/20",
                        deletingId === c.id && "opacity-50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(c.id, c.title);
                      }}
                      disabled={deletingId === c.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Profile />
        </SidebarFooter>
      </Sidebar>
      <Modal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
