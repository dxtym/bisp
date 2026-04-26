"use client";

import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LuPin, LuPinOff, LuTrash2 } from "react-icons/lu";
import { cn } from "@/lib/utils";
import Title from "@/components/title";

interface MenuItemProps {
  c: { id: string; title: string; isPinned?: boolean };
  isActive: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  onTitleSave: (id: string, title: string) => Promise<void>;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

export default function MenuItem({ c, isActive, isDeleting, onSelect, onDelete, onTitleSave, onTogglePin }: MenuItemProps) {
  const pinned = !!c.isPinned;
  const stopAndRun = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <SidebarMenuItem>
      <div
        className={cn(
          "group/item flex w-full items-center gap-2 rounded-sm px-3 py-1 text-sm transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
          isDeleting && "pointer-events-none animate-pulse opacity-50",
        )}
      >
        <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-2" onClick={onSelect}>
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
            "h-6 w-6 p-0 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover/item:opacity-100 hover:bg-accent hover:text-foreground",
            isDeleting && "opacity-50",
          )}
          onClick={stopAndRun(() => onTogglePin(c.id, !pinned))}
          disabled={isDeleting}
          aria-label={pinned ? "Arxivdan olib tashlash" : "Arxivga qo'shish"}
        >
          {pinned ? <LuPinOff className="h-3.5 w-3.5" /> : <LuPin className="h-3.5 w-3.5" />}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover/item:opacity-100 ring-destructive/20 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2",
            isDeleting && "opacity-50",
          )}
          onClick={stopAndRun(() => onDelete(c.id))}
          disabled={isDeleting}
        >
          <LuTrash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </SidebarMenuItem>
  );
}
