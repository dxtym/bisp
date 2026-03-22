"use client"

import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { uploadFile, clearFile, selectLoading, selectFileName } from "@/lib/store/slices/connection";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { LuFileSpreadsheet, LuX } from "react-icons/lu";

export default function FileTab() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loading = useAppSelector(selectLoading);
  const fileName = useAppSelector(selectFileName);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(uploadFile(file)).unwrap();
      toast.success("Fayl muvaffaqiyatli yuklandi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Yuklashda xatolik");
    }
  };

  const handleClear = () => {
    dispatch(clearFile());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
      {fileName ? (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
          <LuFileSpreadsheet className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-xs">{fileName}</span>
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LuX className="size-3.5" />
          </button>
        </div>
      ) : (
        <InputGroup className="flex justify-center w-full">
          <InputGroupInput
            readOnly
            placeholder="Excel fayl tanlang"
            className="text-xs flex-1 cursor-pointer"
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="default"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              Yuklash
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )}
    </>
  );
}
