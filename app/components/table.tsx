"use client"

import { LuChevronDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TableProps {
  name: string;
  columns: string[];
}

export default function Table({ name, columns }: TableProps) {
  return (
    <Collapsible className="rounded-md bg-sidebar-accent/80">
      <div className="flex items-center justify-between py-0.5 px-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-green-500 size-2" />
          <span className="text-sm font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{columns.length} ta ustun</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7">
              <LuChevronDown className="size-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="flex flex-col gap-1 px-2 pb-2">
        {columns.map((column) => (
          <div
            key={column}
            className="px-2 py-1.5 text-xs font-mono bg-background rounded"
          >
            {column}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
