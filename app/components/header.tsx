"use client"

import { LuPlus } from "react-icons/lu";
import { Button } from "./ui/button";

type MenuHeaderProps = {
  onCreate: () => void
};

export default function Header({ onCreate }: MenuHeaderProps) {
  return (
    <div className="flex justify-between items-center p-1">
      <p className="text-sm font-semibold">Suhbatlar</p>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 rounded-md"
        onClick={onCreate}
      >
        <LuPlus />
      </Button>
    </div>
  );
}
