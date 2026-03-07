"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export default function Modal({
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Suhbatni ochirish</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Bu amalni qaytarib bolmaydi.</p>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Bekor qilish
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
          >
            Ochirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
