"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getSchema, selectSchema, selectUrl, setUrl, clearUrl } from "@/lib/store/slices/connection";
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
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Kuzatuv Paneli</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Malumotlar omboringizni sozlang
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Sozlama</p>
        <div className="flex flex-col gap-1.5">
          <InputGroup className="flex justify-center w-full">
            <InputGroupInput
              value={url}
              onChange={(e) => dispatch(setUrl(e.target.value))}
              placeholder="https://username:password@host:port/database"
              className="text-xs flex-1"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="default"
                onClick={handleConnect}
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
        {schema.map((s) => (
          <Table key={s.table} name={s.table} columns={s.columns} />
        ))}
      </div>
    </div>
  );
}
