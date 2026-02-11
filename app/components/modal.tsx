"use client"

import * as React from "react"
import { Database, Loader2, LucidePlay } from "lucide-react"
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
import { Button } from "@/components/ui/button"

interface QueryResultModalProps {
  query: string;
  onQueryExecute?: (query: string) => Promise<void>
}

export function Modal({ query, onQueryExecute }: QueryResultModalProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [tableData, setTableData] = React.useState<Record<string, unknown>[]>([])

  const handleExecuteQuery = async () => {
    if (!query) return

    setOpen(true)
    setLoading(true)
    setError(null)
    setTableData([])

    try {
      const response = await fetch('/api/clickhouse/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
      })

      const result = await response.json()

      if (result.success && result.data?.data) {
        setTableData(result.data.data)
        if (onQueryExecute) {
          await onQueryExecute(query)
        }
      } else {
        setError(result.message || 'Failed to execute query')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Query execution error:', err)
    } finally {
      setLoading(false)
    }
  }

  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : []

  return (
    <>
      <Button
        variant="default"
        size="sm"
        className="rounded-full w-8 h-8 p-0 shadow-md hover:shadow-lg transition-all"
        onClick={handleExecuteQuery}
        title="Execute query"
      >
        <LucidePlay className="w-3 h-3 fill-current" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Query Results
            </DialogTitle>
            <DialogDescription className="text-xs font-mono bg-muted p-3 rounded-md mt-2 max-h-24 overflow-y-auto">
              {query}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">Executing query...</span>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && tableData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Database className="w-12 h-12 mb-3 opacity-50" />
                <p>No results found</p>
              </div>
            )}

            {!loading && !error && tableData.length > 0 && (
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
                      {tableData.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-muted/30">
                          {columns.map((column) => (
                            <TableCell key={`${rowIndex}-${column}`} className="whitespace-nowrap">
                              {String(row[column] ?? '')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground border-t">
                  {tableData.length} row{tableData.length !== 1 ? 's' : ''} returned
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
