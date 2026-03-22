"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getSchema, selectUrl, selectLoading, setUrl, clearUrl } from "@/lib/store/slices/connection";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";

export default function DbTab() {
  const dispatch = useAppDispatch();
  const url = useAppSelector(selectUrl);
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
    <InputGroup className="flex justify-center w-full">
      <InputGroupInput
        value={url}
        onChange={(e) => dispatch(setUrl(e.target.value))}
        placeholder="Malumotlar ombori ulanish manzili"
        className="text-xs flex-1"
        disabled={loading}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="default" onClick={handleConnect} disabled={loading}>
          Ulanish
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
