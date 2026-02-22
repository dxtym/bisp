import { LucideBookOpen } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="my-5 mx-[25%]">
      <div className="mx-auto backdrop-blur-lg border border-zinc-800 rounded-md px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center space-x-2">
            <LucideBookOpen className="w-5 h-5" />
            <div className="text-neutral-100 font-semibold text-md">
              Kutoob
            </div>
          </div>
          <Link href="/sign-in">
            <Button variant="default" className="px-4 py-2 rounded-sm">
              Kirish
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
