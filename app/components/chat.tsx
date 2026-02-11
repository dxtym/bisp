"use client"

import { useEffect, useRef } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import { MessageSquare, Lightbulb } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent
} from "@/components/ai-elements/message";
import Prompt from "./prompt";
import ChatMessage from "./message";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectConversation, addMessage } from "@/lib/store/slices/conversation";
import { IMessage } from "@/lib/mongodb/models/conversation";
import { nanoid } from "nanoid";

export default function Chat() {
  const messagesRef = useRef(0);

  const { messages, status, sendMessage, setMessages } = useChat();

  const dispatch = useAppDispatch();
  const conversation = useAppSelector(selectConversation);

  useEffect(() => {
    if (!conversation) return;

    const messages = conversation.messages.map((m: IMessage) => ({
      id: nanoid(),
      role: m.role,
      parts: [{
        type: "text",
        text: m.content,
      }]
    } as UIMessage));

    setMessages(messages);
    messagesRef.current = messages.length;
  }, [conversation, setMessages]);

  useEffect(() => {
    if (!conversation) return;

    if (messages.length > messagesRef.current) {
      const last = messages[messages.length - 1];
      const message: IMessage = {
        role: last.role as "user" | "assistant",
        content: last.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(""),
        createdAt: new Date(),
      };

      dispatch(addMessage({
        conversationId: conversation.id,
        message: message,
      }));

      messagesRef.current = messages.length;
    }
  }, [messages, conversation, dispatch]);

  return (
    <div className="grid h-full grid-rows-[1fr_auto]">
      <div className="flex justify-center overflow-hidden">
        <Conversation className="w-full max-w-2xl">
          <ConversationContent className="px-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Hech qanday xabar yoq"
                description="Suhbatni boshlash uchun savol bering."
                icon={<MessageSquare className="size-12" />}
              />
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {status === "submitted" && (
              <Message from="assistant" key="thinking">
                <MessageContent>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lightbulb className="size-4" />
                    <span>Fikrlayapman...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
      <Prompt status={status} onSubmit={sendMessage} />
    </div>
  )
}
