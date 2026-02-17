"use client"

import { UIMessage } from "ai"
import { LucideCopy } from "lucide-react"
import Card, { ToolState } from "@/components/card"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message"

interface Props {
  message: UIMessage
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
}

export default function ChatMessage({ message, onApprove, onDeny }: Props) {
  return (
    <Message from={message.role} key={message.id}>
      <MessageContent> 
        {message.parts.map((part, i) => {
          if (part.type === "text" && part.text) {
            return (
              <div key={i} className="whitespace-pre-wrap">
                <MessageResponse>{part.text}</MessageResponse>
              </div>
            )
          }
          if (part.type.startsWith("tool-")) {
            const toolPart = part as Record<string, unknown>
            const toolName = part.type.replace("tool-", "")
            return (
              <Card
                key={i}
                toolName={toolName}
                state={toolPart.state as ToolState}
                input={toolPart.input as Record<string, unknown>}
                output={toolPart.output}
                errorText={toolPart.errorText as string}
                approvalId={(toolPart.approval as { id: string })?.id}
                onApprove={onApprove}
                onDeny={onDeny}
              />
            )
          }
        })}
      </MessageContent>
      {message.role === "assistant" && (
        <MessageActions>
          <MessageAction label="Nusxa olish" onClick={() => {
            navigator.clipboard.writeText(
              message.parts.
                filter((part) => part.type === "text").
                map((part) => part.text).
                join("")
            )
          }}>
            <LucideCopy className="size-4" />
          </MessageAction>
        </MessageActions>
      )}
    </Message>
  )
}
