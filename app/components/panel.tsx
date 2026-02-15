"use client"

import { useState } from "react";

import { Schema } from "@/lib/repository/system";

import { LucideChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export default function Panel() {
  const [schema, setSchema] = useState<Schema[]>([]);
  const [connectionString, setConnectionString] = useState<string>("");

  const handleConnect = async () => {
    try {
      const connectionResponse = await fetch("/api/clickhouse/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connectionString }),
      });
      await connectionResponse.json();

      const schemaResponse = await fetch("/api/clickhouse/schema");
      const schemaJSON = await schemaResponse.json();
      setSchema(schemaJSON.data);
    } catch (error) {
      console.error("Connection error:", error);
    }
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex flex-col gap-2 my-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Kuzatuv Paneli</h1>
          <p className="text-muted-foreground text-sm mt-1">Ma’lumotlar omboringizni shu yerni o’zida sozlang</p>
        </div>
        <Separator className="my-2" />
        <div className="flex w-full items-center gap-2">
          <InputGroup className="flex justify-center w-full">
            <InputGroupInput
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder="https://username:password@host:port/database"
              className="font-sans text-xs"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="default"
                onClick={handleConnect}
              >
                Ulanish
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-row  justify-between gap-1">
          <p className="text-sm text-muted-foreground">Tuzilma</p>
          <p className="text-sm">{`${schema?.length} ta jadval`}</p>
        </div>
      </div>
      <div className="h-180 mb-3 overflow-y-auto gap-2">
        {schema?.map((s) => (
          <Collapsible
            key={s.table}
            className="flex flex-col w-full border border-neutral-600 rounded-md my-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 pl-2">
                <div className="rounded-full bg-green-500 w-2 h-2"></div>
                <h4 className="text-sm font-semibold">{s.table}</h4>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-sm">{`${s?.columns.length} ta ustun`}</p>
                <CollapsibleTrigger asChild>
                  <Button variant="link" size="icon" className="size-8">
                    <LucideChevronDown />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className="flex flex-col gap-2 py-2">
              {s.columns.map((column) => (
                <div key={column} className="flex items-center mx-2 px-2 rounded-md border">
                  <div className="px-2 py-2 text-xs font-mono">{column}</div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div >
  );
}
