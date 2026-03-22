"use client"

import { motion, AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setMode, selectSchema, selectLoading, selectMode } from "@/lib/store/slices/connection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Table from "./table";
import DbTab from "./db-tab";
import FileTab from "./file-tab";
import { Badge } from "./ui/badge";
import { Database, FileSpreadsheet } from "lucide-react";

export default function Panel() {
  const dispatch = useAppDispatch();
  const schema = useAppSelector(selectSchema);
  const loading = useAppSelector(selectLoading);
  const mode = useAppSelector(selectMode);

  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <Tabs
        value={mode}
        onValueChange={(v) => dispatch(setMode(v as "database" | "file"))}
        className="gap-0"
      >
        <div className="flex flex-col gap-3">
          <TabsList className="w-full !h-8 !rounded-sm">
            <TabsTrigger value="database" className="flex-1 text-sm"><Database className="size-3.5" />Ombor</TabsTrigger>
            <TabsTrigger value="file" className="flex-1 text-sm"><FileSpreadsheet className="size-3.5" />Fayl</TabsTrigger>
          </TabsList>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Sozlama</p>
            {mode === "file" && (
              <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10 py-0 text-xs rounded-sm">Beta</Badge>
            )}
          </div>
        </div>
        <TabsContent value="database" className="mt-3">
          <DbTab />
        </TabsContent>
        <TabsContent value="file" className="mt-3">
          <FileTab />
        </TabsContent>
      </Tabs>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Tuzilma</p>
        <p className="text-sm text-muted-foreground">{schema.length} ta jadval</p>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="h-8 rounded-md bg-sidebar-accent/80 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {schema.map((s, i) => (
              <motion.div
                key={s.table}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, delay: i * 0.04, ease: "easeOut" }}
              >
                <Table name={s.table} columns={s.columns} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
