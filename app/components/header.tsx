"use client"

import { LuPlus } from "react-icons/lu";
import { Button } from "./ui/button";

type MenuHeaderProps = {
  onCreate: () => void
};

export default function Header({ onCreate }: MenuHeaderProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <p className="text-muted-foreground">Suhbatlar</p>
      <Button
        size="sm"
        variant="ghost"
        className="p-[3.5] h-5 w-5 rounded-full"
        onClick={onCreate}
      >
        <LuPlus />
      </Button>
    </div>
  );
}
