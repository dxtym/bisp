"use client";

import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LuTrash2 } from "react-icons/lu";
import { cn } from "@/lib/utils";
import Title from "@/components/title";

interface MenuItemProps {
  c: { id: string; title: string };
  isActive: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  onTitleSave: (id: string, title: string) => Promise<void>;
}

export default function MenuItem({ c, isActive, isDeleting, onSelect, onDelete, onTitleSave }: MenuItemProps) {
  return (
    <SidebarMenuItem>
      <div
        className={cn(
          "group/item flex w-full items-center gap-2 rounded-sm py-1 px-3 text-sm transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
          isDeleting && "opacity-50 pointer-events-none animate-pulse"
        )}
      >
        <div className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer" onClick={onSelect}>
          <Title
            title={c.title}
            onSave={(title) => onTitleSave(c.id, title)}
            isActive={isActive}
            disabled={isDeleting}
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 shrink-0 transition-all duration-200",
            "opacity-0 group-hover/item:opacity-100",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            "focus-visible:ring-2 ring-destructive/20",
            isDeleting && "opacity-50"
          )}
          onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
          disabled={isDeleting}
        >
          <LuTrash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </SidebarMenuItem>
  );
}
