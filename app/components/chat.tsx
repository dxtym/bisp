"use client"

import { useRef, useState } from "react";
import { useChat } from '@ai-sdk/react';
import { MessageSquare } from "lucide-react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
  PromptInputTextarea
} from "@/components/ai-elements/prompt-input"
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
import { DefaultChatTransport } from "ai";

export default function Chat() {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } };
      },
    })
  });

  return (
    <div className="grid grid-rows-[1fr_auto] h-full">
      <div className="flex justify-center pt-8 px-50 overflow-y-auto">
        <Conversation>
          <ConversationContent className="h-full">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Hech qanday xabar yo'q"
                description="Suhbatni boshlash uchun savol bering."
                icon={<MessageSquare className="size-12" />}
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      return (
                        <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                          {part.type === 'text' ? part.text : ""}
                        </div>
                      );
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
      <div className="flex items-end pb-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <PromptInput onSubmit={(message: PromptInputMessage) => {
            sendMessage(message);
            setText('');
          }} className="mt-4" globalDrop multiple>
            <PromptInputBody>
              <PromptInputTextarea
                value={text}
                ref={textareaRef}
                placeholder="Nima haqida bilmoqchisiz?"
                onChange={(e) => setText(e.target.value)}
              />
            </PromptInputBody>
            <PromptInputFooter className="flex justify-end">
              <PromptInputSubmit disabled={!text && !status} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}
