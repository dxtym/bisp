import { useState } from "react";
import { SCROLLBAR_THIN } from "@/lib/constants/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LuCheck, LuChevronDown, LuWrench, LuX } from "react-icons/lu";

export type ToolState = "input-streaming" | "input-available" | "approval-requested" | "output-available" | "output-error"

const STATE_LABELS: Record<ToolState, string> = {
  "input-streaming": "Tayyorlanmoqda",
  "input-available": "Bajarilmoqda",
  "approval-requested": "Tasdiqlash",
  "output-available": "Tayyor",
  "output-error": "Xatolik"
}

const TOOL_NAMES: Record<string, string> = {
  "translator": "Tarjimon",
  "generator": "Mutafakkir",
  "executor": "Ijrochi"
}

interface Props {
  toolName: string
  state: ToolState
  input?: Record<string, unknown>
  output?: unknown
  errorText?: string
  approvalId?: string
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
}

function Params({ input }: { input?: Record<string, unknown> }) {
  if (!input || Object.keys(input).length === 0) return null
  return (
    <div className="border-b border-border p-2">
      <p className="mb-1 text-xs font-medium text-muted-foreground">Parametrlar</p>
      <pre
        className="overflow-x-auto rounded bg-muted/50 p-2 text-xs pb-4"
        style={SCROLLBAR_THIN}
      >
        <code className="block whitespace-pre">{JSON.stringify(input, null, 2)}</code>
      </pre>
    </div>
  )
}

interface ApprovalProps {
  approvalId?: string
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
}

function Approval({ approvalId, onApprove, onDeny }: ApprovalProps) {
  if (!approvalId) return null
  return (
    <div className="flex items-center gap-2 p-2">
      <Button size="sm" onClick={() => onApprove?.(approvalId)}>
        <LuCheck className="size-3" />
        Tasdiqlash
      </Button>
      <Button size="sm" variant="outline" onClick={() => onDeny?.(approvalId)}>
        <LuX className="size-3" />
        Bekor qilish
      </Button>
    </div>
  )
}

function Result({ output }: { output?: unknown }) {
  return (
    <div className="p-2">
      <p className="mb-1 text-xs font-medium text-muted-foreground">Natija</p>
      <pre
        className="overflow-x-auto rounded bg-muted/50 p-2 text-xs pb-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(138 138 138) transparent'
        }}
      >
        <code className="block whitespace-pre">{typeof output === "string" ? output : JSON.stringify(output, null, 2)}</code>
      </pre>
    </div>
  )
}

function Err({ errorText }: { errorText?: string }) {
  return (
    <div className="p-2">
      <p className="text-sm text-destructive">{errorText}</p>
    </div>
  )
}

export default function Tool({
  toolName,
  state,
  input,
  output,
  errorText,
  approvalId,
  onApprove,
  onDeny
}: Props) {
  const [isOpen, setIsOpen] = useState(state === "approval-requested")

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="my-1">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-t border p-2 text-sm">
        <div className="flex items-center gap-2">
          <LuWrench className="size-3.5 text-muted-foreground" />
          <span className="font-medium">{TOOL_NAMES[toolName]}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={`
              gap-1 text-xs
              ${state === "output-available" ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
              ${state === "output-error" ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : ''}
            `}
          >
            {STATE_LABELS[state]}
          </Badge>
          <LuChevronDown className={`size-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-b border border-t-0 bg-background/50">
        <Params input={input} />
        {state === "approval-requested" && (
          <Approval approvalId={approvalId} onApprove={onApprove} onDeny={onDeny} />
        )}
        {state === "output-available" && <Result output={output} />}
        {state === "output-error" && <Err errorText={errorText} />}
      </CollapsibleContent>
    </Collapsible>
  )
}
