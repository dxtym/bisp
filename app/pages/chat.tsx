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
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message";

export default function Chat() {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, status, sendMessage } = useChat();

  return (
    <div className="grid grid-rows-[1fr_auto] h-full">
      <div className="flex justify-center pt-8 px-50 overflow-y-auto">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Suhbatni boshlang"
                description="Suhbatni boshlash uchun quyida xabar yozing"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      return (
                        <MessageResponse key={`${message.id}-${i}`}>
                          {part.type === 'text' ? part.text : ""}
                        </MessageResponse>
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
      <div className="flex items-end pb-8 px-50">
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
  )
}
