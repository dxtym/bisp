"use client"

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchConversations, fetchActiveConversation } from "./slices/conversationSlice";

export function ConversationInit() {
  const clerk = useClerk();
  const userId = clerk.user?.id;
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector((state) => state.conversation.activeConversationId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchConversations(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (activeConversationId) {
      dispatch(fetchActiveConversation(activeConversationId));
    }
  }, [activeConversationId, dispatch]);

  return null;
}
