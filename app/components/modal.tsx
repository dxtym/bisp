"use client"

import { Database } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { closeModal, selectModal } from "@/lib/store/slices/modal"

export function Modal() {
  const dispatch = useAppDispatch()
  const { table, isOpen } = useAppSelector(selectModal);

  const columns = table.length > 0 ? Object.keys(table[0]) : []

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="max-w-[90vw] w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Natijalar
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          {table.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Database className="w-12 h-12 mb-3 opacity-50" />
              <p>Topilmadi</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {columns.map((column) => (
                        <TableHead key={column} className="font-semibold whitespace-nowrap">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        {columns.map((column) => (
                          <TableCell key={`${i}-${column}`} className="whitespace-nowrap">
                            {String(row[column] ?? '')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
