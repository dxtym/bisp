import { LuBookOpen } from "react-icons/lu"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <div className={`bg-black text-white flex flex-col justify-between h-screen p-10 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <LuBookOpen className="size-5" />
        <span className="font-semibold text-lg">Kutoob</span>
      </div>
      <blockquote className="space-y-3">
        <p className="text-lg relaxed">
          &ldquo;Bu dastur malumotlar bilan ishlash usulimizni butunlay ozgartirdi. Endi hech qanday texnik bilimsiz ham kerakli javoblarni bir zumda olish mumkin. Ajoyib.&rdquo;
        </p>
        <footer className="text-base text-zinc-500">
          — Jasur Toshmatov, Malumotlar tahlilchisi
        </footer>
      </blockquote>
    </div>
  )
}
