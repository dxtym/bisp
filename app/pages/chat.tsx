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

  const handleSubmit = (message: PromptInputMessage) => {
    sendMessage(message);
    setText('');
  }

  return (
    <div className="grid grid-rows-[1fr_auto] h-full">
      <div className="flex justify-center pt-8 px-50 overflow-y-auto">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
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
        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              ref={textareaRef}
              value={text}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
