"use client"

import { type ComponentType, useRef, useState, useCallback } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector"
import { ChatStatus } from "ai";
import { useAppSelector } from "@/lib/store/hooks";
import { selectUrl } from "@/lib/store/slices/connection";
import { SiClickhouse, SiPostgresql } from "react-icons/si";
import { CheckIcon } from "lucide-react";
import type { DbType } from "@/lib/db/types";
import { detectDbType } from "@/lib/db/factory";

type DbOption = {
  type: DbType;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const DB_OPTIONS: DbOption[] = [
  { type: "clickhouse", label: "ClickHouse", Icon: SiClickhouse },
  { type: "postgres",   label: "PostgreSQL", Icon: SiPostgresql },
];


interface PromptProps {
  status: ChatStatus;
  onSubmit: (message: PromptInputMessage) => void;
}

export default function Prompt({ onSubmit, status }: PromptProps) {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const url = useAppSelector(selectUrl);

  const dbType = url ? detectDbType(url) : "clickhouse";
  const dbLabel = dbType === "postgres" ? "PostgreSQL" : "ClickHouse";

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    if (!message.text) return;
    onSubmit(message);
    setText('');
  }, [onSubmit, setText]);

  const { Icon: DbIcon } = DB_OPTIONS.find((o) => o.type === dbType)!;

  return (
    <div className="flex my-3">
      <div className="w-full max-w-2xl mx-auto">
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={text}
              ref={textareaRef}
              placeholder="Nima haqida bilmoqchisiz?"
              onChange={(e) => setText(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter className="flex justify-between items-center">
            <PromptInputTools>
              <ModelSelector>
                <ModelSelectorTrigger asChild>
                  <PromptInputButton size="sm">
                    <DbIcon className="size-3.5" />
                    {dbLabel}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Qidiring..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>Topilmadi</ModelSelectorEmpty>
                    <ModelSelectorGroup>
                      {DB_OPTIONS.map(({ type, label, Icon }) => (
                        <ModelSelectorItem key={type} value={label} disabled>
                          <Icon className="size-4" />
                          <ModelSelectorName>{label}</ModelSelectorName>
                          {type === dbType && <CheckIcon className="ml-auto size-3.5" />}
                        </ModelSelectorItem>
                      ))}
                    </ModelSelectorGroup>
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
