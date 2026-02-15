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
import { Modal } from "./modal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectConversation, addMessage } from "@/lib/store/slices/conversation";
import { IMessage } from "@/lib/mongodb/models/conversation";
import { nanoid } from "nanoid";

export default function Chat() {
  const messageRef = useRef<string>("");
  const conversationRef = useRef<string>("");

  const { messages, status, sendMessage, setMessages } = useChat();

  const dispatch = useAppDispatch();
  const conversation = useAppSelector(selectConversation);

  useEffect(() => {
    if (!conversation) return;
    if (conversationRef.current === conversation.id) return;

    const currentMessages = conversation.messages.map((m: IMessage) => ({
      id: nanoid(),
      role: m.role,
      parts: [{
        type: "text",
        text: m.content,
      }]
    } as UIMessage));

    setMessages(currentMessages);
    messageRef.current = messages[messages.length - 1]?.id;
    conversationRef.current = conversation.id;
  }, [conversation, setMessages]);

  useEffect(() => {
    if (!conversation || !messages) return;

    const last = messages.at(-1);
    if (!last) return;

    const parts = last.parts.filter(p => p.type === "text");
    if (!parts.length) return;

    if (last.role === "assistant") {
      const done = parts.every(p => p.state === "done");
      if (!done) return;
    }

    if (messageRef.current === last.id) return;
    dispatch(
      addMessage({
        conversationId: conversation.id,
        message: {
          role: last.role as "user" | "assistant",
          content: parts
            .map(p => p.text ?? "")
            .join("")
            .trim(),
          createdAt: new Date().toISOString(),
        },
      })
    );

    messageRef.current = last.id;
  }, [messages, dispatch, conversation]);

  return (
    <div className="grid h-full grid-rows-[1fr_auto]">
      <div className="flex justify-center overflow-hidden">
        <Conversation className="w-full max-w-2xl">
          <ConversationContent className="max-h-[100] px-0">
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
                  <div className="flex items-center gap-2 text-white">
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
      <Modal />
    </div>
  )
}
