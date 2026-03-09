"use client"

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getSchema, selectSchema, selectUrl, selectLoading, setUrl, clearUrl } from "@/lib/store/slices/connection";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group";
import { toast } from "sonner";
import Table from "./table";

export default function Panel() {
  const dispatch = useAppDispatch();

  const url = useAppSelector(selectUrl);
  const schema = useAppSelector(selectSchema);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(clearUrl());
  }, [dispatch]);

  const handleConnect = async () => {
    if (!url.trim()) {
      toast.error("Ulanish manzilini kiriting");
      return;
    }

    try {
      await dispatch(getSchema({ url })).unwrap();
      toast.success("Muvaffaqiyatli ulandi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ulanishda xatolik");
    }
  };

  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Sozlama</p>
        <div className="flex flex-col gap-1.5">
          <InputGroup className="flex justify-center w-full">
            <InputGroupInput
              value={url}
              onChange={(e) => dispatch(setUrl(e.target.value))}
              placeholder="https://username:password@host:port/database"
              className="text-xs flex-1"
              disabled={loading}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="default"
                onClick={handleConnect}
                disabled={loading}
              >
                Ulanish
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
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
