"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LuTrash2 } from "react-icons/lu"

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LuTrash2 className="h-5 w-5 text-destructive" />
            Suhbatni ochirish
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Qaytish
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Ochirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
