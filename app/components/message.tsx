"use client"

import { UIMessage } from "ai"
import Tool, { ToolState, TOOL_NAMES } from "@/components/tool"
import {
  Message,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message"
import { Task, TaskTrigger, TaskContent, TaskItem } from "@/components/ai-elements/task"
import { LuCheck, LuChevronDown, LuCircle, LuLoader, LuX } from "react-icons/lu"

interface Props {
  message: UIMessage
  onApprove?: (id: string, editedQuery?: string) => void
  onDeny?: (id: string) => void
}

const PHASES = ["translator", "generator", "executor"] as const

function StatusIcon({ state }: { state?: ToolState }) {
  if (!state) return <LuCircle className="size-3 text-muted-foreground/50" />
  if (state === "output-available") return <LuCheck className="size-3 text-green-600 dark:text-green-400" />
  if (state === "output-error") return <LuX className="size-3 text-red-600 dark:text-red-400" />
  return <LuLoader className="size-3 animate-spin text-muted-foreground" />
}

function Flow({ message }: { message: UIMessage }) {
  const stateByPhase = new Map<string, ToolState>()
  for (const part of message.parts) {
    if (!part.type.startsWith("tool-")) continue
    const phase = part.type.replace("tool-", "")
    stateByPhase.set(phase, (part as { state: ToolState }).state)
  }
  if (stateByPhase.size === 0) return null
  const allDone = PHASES.every((p) => stateByPhase.get(p) === "output-available")
  if (allDone) return null

  return (
    <Task defaultOpen className="mt-2">
      <TaskTrigger title="Reja">
        <div className="flex w-full cursor-pointer items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground group">
          <p className="text-sm">Reja</p>
          <LuChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </div>
      </TaskTrigger>
      <TaskContent>
        {PHASES.map((phase) => (
          <TaskItem key={phase} className="flex items-center gap-2">
            <StatusIcon state={stateByPhase.get(phase)} />
            <span>{TOOL_NAMES[phase]}</span>
          </TaskItem>
        ))}
      </TaskContent>
    </Task>
  )
}

export default function Bubble({ message, onApprove, onDeny }: Props) {
  return (
    <Message from={message.role} key={message.id}>
      <MessageContent className={message.role === "assistant" ? "w-full" : ""}>
        {message.role === "assistant" && <Flow message={message} />}
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
              <Tool
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
