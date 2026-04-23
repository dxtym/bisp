"use client"

import { type ComponentType, useRef, useState, useCallback } from "react";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Panel from "@/components/panel";
import { ChatStatus } from "ai";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectUrl, selectSchema, selectDbType, setDbType } from "@/lib/store/slices/connection";
import { SiClickhouse, SiPostgresql } from "react-icons/si";
import { CheckIcon, SlidersHorizontal } from "lucide-react";
import { type DbType, detectDbType } from "@/lib/db/types";

type DbOption = {
  type: DbType;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const DB_OPTIONS: DbOption[] = [
  { type: "clickhouse", label: "ClickHouse", Icon: SiClickhouse },
  { type: "postgres", label: "PostgreSQL", Icon: SiPostgresql },
];

const SUGGESTIONS = [
  "Eng kop sotilgan mahsulotlar qaysilar?",
  "Oxirgi oyda daromad qancha boldi?",
  "Faol foydalanuvchilar sonini korsat",
];

interface PromptProps {
  status: ChatStatus;
  onSubmit: (message: PromptInputMessage) => void;
}

export default function Prompt({ onSubmit, status }: PromptProps) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const url = useAppSelector(selectUrl);
  const schema = useAppSelector(selectSchema);
  const selectedDbType = useAppSelector(selectDbType);

  const isConnected = !!url || schema.length > 0;
  const displayedDbType: DbType = isConnected ? detectDbType(url) : selectedDbType;
  const { Icon: DbIcon, label: dbLabel } = DB_OPTIONS.find((o) => o.type === displayedDbType)!;

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    if (!message.text) return;
    onSubmit(message);
    setText('');
  }, [onSubmit, setText]);

  return (
    <div className="flex my-3">
      <div className="w-full max-w-2xl mx-auto">
        {!text && (
          <Suggestions className="my-1">
            {SUGGESTIONS.map((s) => (
              <Suggestion key={s} suggestion={s} onClick={(v) => setText(v)} className="rounded-md" />
            ))}
          </Suggestions>
        )}
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
              <Sheet>
                <SheetTrigger asChild>
                  <PromptInputButton size="sm">
                    <SlidersHorizontal className="size-3.5" />
                  </PromptInputButton>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 flex flex-col sm:max-w-sm" showCloseButton={false}>
                  <SheetTitle className="sr-only">Sozlama</SheetTitle>
                  <Panel />
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PromptInputButton size="sm" disabled={isConnected}>
                    <DbIcon className="size-3.5" />
                    {dbLabel}
                  </PromptInputButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {DB_OPTIONS.map(({ type, label, Icon }) => (
                    <DropdownMenuItem key={type} onSelect={() => dispatch(setDbType(type))}>
                      <Icon className="size-4" />
                      {label}
                      {type === displayedDbType && <CheckIcon className="ml-auto size-3.5" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
