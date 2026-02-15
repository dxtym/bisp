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
import { openModal, executeQuery } from "@/lib/store/slices/modal";

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

  const handleExecute = () => {
    const content = unwrapParts(message);
    dispatch(openModal(content));
    dispatch(executeQuery(content));
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
            label="Execute"
            onClick={handleExecute}
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
    </>
  );
}
