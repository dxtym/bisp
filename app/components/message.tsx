"use client"

import { UIMessage } from "ai"
import Card, { ToolState } from "@/components/card"
import {
  Message,
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
      <MessageContent className={message.role === "assistant" ? "w-full" : ""}>
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
    </Message>
  )
}
