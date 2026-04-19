"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  getSchema,
  selectUrl,
  selectLoading,
  selectDbType,
  setUrl,
  clearUrl,
} from "@/lib/store/slices/connection";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const DEFAULT_CLICKHOUSE_URL = process.env.NEXT_PUBLIC_DEFAULT_CLICKHOUSE_URL ?? "";
const DEFAULT_POSTGRES_URL = process.env.NEXT_PUBLIC_DEFAULT_POSTGRES_URL ?? "";

export default function DbTab() {
  const dispatch = useAppDispatch();
  const url = useAppSelector(selectUrl);
  const loading = useAppSelector(selectLoading);
  const selectedDbType = useAppSelector(selectDbType);

  useEffect(() => {
    dispatch(clearUrl());
  }, [dispatch]);

  const defaultUrl = selectedDbType === "postgres" ? DEFAULT_POSTGRES_URL : DEFAULT_CLICKHOUSE_URL;
  
  const handleConnect = async () => {
    const target = url.trim() || defaultUrl;
    if (!url.trim()) dispatch(setUrl(defaultUrl));
    try {
      await dispatch(getSchema({ url: target })).unwrap();
      toast.success("Muvaffaqiyatli ulandi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ulanishda xatolik");
    }
  };

  return (
    <InputGroup className="flex justify-center w-full">
      <InputGroupInput
        value={url}
        onChange={(e) => dispatch(setUrl(e.target.value))}
        placeholder="Ulanish manzilini kiriting"
        className="text-xs flex-1"
        disabled={loading}
      />
      <InputGroupAddon align="inline-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton variant="default" onClick={handleConnect} disabled={loading}>
                Ulanish
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent side="top">
              Namuna
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </InputGroupAddon>
    </InputGroup>
  );
}
