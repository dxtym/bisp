"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LuCopy, LuLink, LuUnlink } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  shareConversation,
  unshareConversation,
} from "@/lib/store/slices/conversation";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  shareToken?: string | null;
}

export default function ShareDialog({ open, onOpenChange, conversationId, shareToken }: ShareDialogProps) {
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);

  const url = shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/s/${shareToken}`
    : "";

  const handleCreate = async () => {
    setBusy(true);
    try {
      await dispatch(shareConversation(conversationId)).unwrap();
      toast.success("Havola yaratildi");
    } catch {
      toast.error("Havola yaratishda xatolik");
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async () => {
    setBusy(true);
    try {
      await dispatch(unshareConversation(conversationId)).unwrap();
      toast.success("Havola bekor qilindi");
    } catch {
      toast.error("Havolani bekor qilishda xatolik");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast.success("Havola nusxalandi");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-6 bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>Suhbatni ulashish</DialogTitle>
          <DialogDescription>
            Havolaga ega bo&apos;lgan{" "}
            <span className="font-semibold underline underline-offset-4 decoration-2">har kim</span>{" "}
            ushbu suhbatni o&apos;qiy oladi.
          </DialogDescription>
        </DialogHeader>

        {shareToken ? (
          <div className="flex items-center gap-2">
            <Input value={url} readOnly className="rounded-sm" />
            <Button size="icon" variant="secondary" onClick={handleCopy} aria-label="Nusxalash">
              <LuCopy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={handleRevoke}
              disabled={busy}
              aria-label="O'chirish"
            >
              <LuUnlink className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={handleCreate} disabled={busy} className="w-full">
            <LuLink className="h-4 w-4" />
            Yaratish
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
