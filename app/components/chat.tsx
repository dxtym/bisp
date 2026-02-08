"use client"

import { useRef, useState, useEffect, useCallback } from "react";
import { useChat } from '@ai-sdk/react';
import { MessageSquare, Lightbulb } from "lucide-react";
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
import { QueryResultModal } from "@/components/modal";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { updateMessages } from "@/lib/store/slices/conversationSlice";

export default function Chat() {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevStatusRef = useRef<string>('ready');

  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector((state) => state.conversation.activeConversationId);
  const activeConversation = useAppSelector((state) => state.conversation.activeConversation);

  const { messages, status, sendMessage, setMessages } = useChat({
    id: activeConversationId ?? undefined,
  });

  useEffect(() => {
    if (activeConversation && activeConversation.messages.length > 0) {
      const loadedMessages = activeConversation.messages.map((msg, index) => ({
        id: `loaded-${index}-${new Date(msg.createdAt).getTime()}`,
        role: msg.role as "user" | "assistant" | "system",
        parts: [{ type: "text" as const, text: msg.content }],
      }));
      setMessages(loadedMessages);
    } else if (activeConversation && activeConversation.messages.length === 0) {
      setMessages([]);
    }
  }, [activeConversation, setMessages]);

  const persistMessages = useCallback(async () => {
    if (!activeConversationId || messages.length === 0) return;

    const messagesToSave = messages.map((msg) => {
      const textContent = msg.parts
        ?.filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text)
        .join("") || "";

      return {
        senderId: msg.role === "user" ? "user" : "assistant",
        role: msg.role as "user" | "assistant" | "system",
        content: textContent,
        createdAt: new Date(),
      };
    });

    dispatch(updateMessages({ conversationId: activeConversationId, messages: messagesToSave }));
  }, [activeConversationId, messages, dispatch]);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    if (
      (prevStatus === 'streaming' || prevStatus === 'submitted') &&
      status === 'ready' &&
      messages.length > 0
    ) {
      persistMessages();
    }
  }, [status, messages.length, persistMessages]);

  const getQueryFromMessage = (message: typeof messages[0]): string => {
    const query = message.parts.filter((part) => part.type === 'text');
    return query.length > 0 ? query[0].text : '';
  };

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
                <>
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        return (
                          <MessageResponse key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                            {part.type === 'text' ? (
                              message.role === 'assistant'
                                ? `\`\`\`\n${part.text}\n\`\`\``
                                : part.text
                            ) : ''}
                          </MessageResponse>
                        );
                      })}
                    </MessageContent>
                  </Message>
                  {
                    status === 'ready' && message.role === 'assistant' && (
                      <div className="flex justify-start mt-2">
                        <QueryResultModal query={getQueryFromMessage(message)} />
                      </div>
                    )
                  }
                </>
              ))
            )}
            {(['streaming', 'submitted'].includes(status)) && (
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
