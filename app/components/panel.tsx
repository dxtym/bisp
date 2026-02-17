"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getSchema, selectSchema, selectUrl, setUrl } from "@/lib/store/slices/connection";
import { LucideChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group";


export default function Panel() {
  const dispatch = useAppDispatch();

  const url = useAppSelector(selectUrl);
  const schema = useAppSelector(selectSchema);

  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Kuzatuv Paneli</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Malumotlar omboringizni sozlang
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Sozlama</p>
        <div className="flex flex-col gap-1.5">
          <InputGroup className="flex justify-center w-full">
            <InputGroupInput
              value={url}
              onChange={(e) => dispatch(setUrl(e.target.value))}
              placeholder="https://username:password@host:port/database"
              className="text-xs flex-1"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="default"
                onClick={() => {
                  if (!url.trim()) return;
                  dispatch(getSchema({ url }));
                }}
              >
                Ulanish
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Tuzilma</p>
        <p className="text-sm text-muted-foreground">{schema.length} ta jadval</p>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {schema.map((s) => (
          <Collapsible
            key={s.table}
            className="border border-neutral-700 rounded-md"
          >
            <div className="flex items-center justify-between py-1 px-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 size-2" />
                <span className="text-sm font-medium">{s.table}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">{s.columns.length} ta ustun</span>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <LucideChevronDown className="size-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className="flex flex-col gap-1 px-2 pb-2">
              {s.columns.map((column) => (
                <div
                  key={column}
                  className="px-2 py-1.5 text-xs font-mono bg-muted/50 rounded"
                >
                  {column}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
