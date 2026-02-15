"use client"

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message";
import { UIMessage } from "ai";
import { LucideCopy, LucidePlay } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { executeQuery, openModal } from "@/lib/store/slices/modal";

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const dispatch = useAppDispatch();

  const unwrapParts = (message: UIMessage): string => {
    return message.parts.
      filter((part) => part.type === "text").
      map((part) => part.text).
      join();
  }

  return (
    <Message from={message.role} key={message.id}>
      <MessageContent>
        {message.parts.map((part, i) => {
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
                <MessageResponse key={i}>
                  {part.type === "text" ? part.text : ""}
                </MessageResponse>
              );
          };
        })}
      </MessageContent>
      {message.role === "assistant" && (
        <MessageActions>
          <MessageAction
            label="Execute"
            onClick={() => {
              dispatch(openModal());
              dispatch(executeQuery(unwrapParts(message)))
            }}
          >
            <LucidePlay className="size-4" />
          </MessageAction>
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
    </Message>
  );
}
