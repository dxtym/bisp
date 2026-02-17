import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LucideCheck, LucideChevronDown, LucideX } from "lucide-react";

export type ToolState = "input-streaming" | "input-available" | "approval-requested" | "output-available" | "output-error"

const STATE_LABELS: Record<ToolState, string> = {
  "input-streaming": "Tayyorlanmoqda",
  "input-available": "Bajarilmoqda",
  "approval-requested": "Tasdiqlash",
  "output-available": "Tayyor",
  "output-error": "Xatolik"
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

export default function Card({
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
        <div className="flex items-center gap-3">
          <span className="font-medium">{toolName}</span>
          <Badge variant="secondary" className="gap-1 text-xs">{STATE_LABELS[state]}</Badge>
        </div>
        <LucideChevronDown className={`size-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-b border border-t-0 bg-background/50">
        {input && Object.keys(input).length > 0 && (
          <div className="border-b border-border p-2">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Parametrlar</p>
            <pre className="rounded bg-muted/50 p-2 text-xs">
              <code>{JSON.stringify(input, null, 2)}</code>
            </pre>
          </div>
        )}
        {state === "approval-requested" && approvalId && (
          <div className="flex items-center gap-2 p-2">
            <Button size="sm" onClick={() => onApprove?.(approvalId)}>
              <LucideCheck className="size-3" />
              Tasdiqlash
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDeny?.(approvalId)}>
              <LucideX className="size-3" />
              Bekor qilish
            </Button>
          </div>
        )}
        {state === "output-available" && (
          <div className="p-2">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Natija</p>
            <pre className="rounded bg-muted/50 p-2 text-xs">
              <code>{typeof output === "string" ? output : JSON.stringify(output, null, 2)}</code>
            </pre>
          </div>
        )}
        {state === "output-error" && (
          <div className="p-2">
            <p className="text-sm text-destructive">{errorText}</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
