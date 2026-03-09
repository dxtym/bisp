"use client"

import { memo, useEffect, useRef } from "react"
import { UIMessage, useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses
} from "ai"
import { LuMessageSquare, LuLightbulb } from "react-icons/lu"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from "@/components/ai-elements/conversation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import Prompt from "./prompt"
import Bubble from "./message"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { selectConversation, addMessage } from "@/lib/store/slices/conversation"
import { IMessage } from "@/lib/mongodb/models/conversation"
import { nanoid } from "nanoid"
import { toast } from "sonner"
import { STORAGE_KEY } from "@/lib/store/slices/connection"
import { Shimmer } from "./ai-elements/shimmer"

const Thinking = memo(function Thinking() {
  return (
    <Message from="assistant">
      <MessageContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <LuLightbulb className="size-4 animate-pulse" />
          <Shimmer>Fikrlayapman...</Shimmer>
        </div>
      </MessageContent>
    </Message>
  )
})

export default function Chat() {
  const messageRef = useRef<string>("");
  const conversationRef = useRef<string>("");

  const { messages, status, sendMessage, setMessages, addToolApprovalResponse } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({
        url: localStorage.getItem(STORAGE_KEY)
      })
    }),
    onError: (error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  const dispatch = useAppDispatch();
  const conversation = useAppSelector(selectConversation);

  useEffect(() => {
    if (!conversation) {
      setMessages([])
      messageRef.current = ""
      conversationRef.current = ""
      return
    }

    if (conversationRef.current === conversation.id) return

    const currentMessages = conversation.messages.map((m: IMessage) => ({
      id: nanoid(),
      role: m.role,
      parts: [{ type: "text", text: m.content }]
    } as UIMessage))

    setMessages(currentMessages)
    messageRef.current = currentMessages[currentMessages.length - 1]?.id || ""
    conversationRef.current = conversation.id
  }, [conversation, setMessages]);

  useEffect(() => {
    if (!conversation || !messages) return

    const last = messages.at(-1)
    if (!last) return

    const parts = last.parts.filter(p => p.type === "text")
    if (!parts.length) return

    if (last.role === "assistant") {
      const done = parts.every(p => p.state === "done")
      if (!done) return
    }

    if (messageRef.current === last.id) return
    dispatch(
      addMessage({
        conversationId: conversation.id,
        message: {
          role: last.role as "user" | "assistant",
          content: parts.map(p => p.text ?? "").join("").trim(),
          createdAt: new Date().toISOString(),
        },
      })
    )
    messageRef.current = last.id
  }, [messages, dispatch, conversation])

  const handleApprove = (approvalId: string) => {
    addToolApprovalResponse({ id: approvalId, approved: true })
  }

  const handleDeny = (approvalId: string) => {
    addToolApprovalResponse({ id: approvalId, approved: false, reason: "Foydalanuvchi rad etdi" })
  }

  return (
    <div className="grid h-full grid-rows-[1fr_auto]">
      <div className="flex justify-center overflow-hidden">
        <Conversation className="w-full max-w-2xl">
          <ConversationContent className="h-full">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Xabarlar yo'q"
                description="Savol bering"
                icon={<LuMessageSquare className="size-12" />}
              />
            ) : (
              messages.map((message) => (
                <Bubble
                  key={message.id}
                  message={message}
                  onApprove={handleApprove}
                  onDeny={handleDeny}
                />
              ))
            )}
            {status === "submitted" && <Thinking />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
      <Prompt status={status} onSubmit={sendMessage} />
    </div>
  )
}
