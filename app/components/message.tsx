"use client"

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message";
import { UIMessage } from "ai";
import { LucideCopy } from "lucide-react";

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const unwrapParts = (message: UIMessage): string => {
    return message.parts.
      filter((part) => part.type === "text").
      map((part) => part.text).
      join();
  }

  return (
    <>
      <Message from={message.role} key={message.id}>
        <MessageContent>
          {message.parts.map((part) => {
            switch (message.role) {
              case "assistant":
                return (
                  <pre className="whitespace-pre-wrap">
                    <code className="font-mono text-sm">
                      <MessageResponse>
                        {part.type === "text" ? part.text : ""}
                      </MessageResponse>
                    </code>
                  </pre>
                );
              case "user":
                return (
                  <MessageResponse>
                    {part.type === "text" ? part.text : ""}
                  </MessageResponse>
                );
            };
          })}
        </MessageContent>
      </Message>
      {message.role === "assistant" && (
        <MessageActions>
          <MessageAction
            label="Copy"
            onClick={() =>
              navigator.clipboard.writeText(unwrapParts(message))
            }
          >
            <LucideCopy className="size-4" />
          </MessageAction>
        </MessageActions>
      )}
    </>
  );
}
