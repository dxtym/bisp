import { LuBookOpen } from "react-icons/lu";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="my-5 mx-[25%]">
      <div className="mx-auto backdrop-blur-lg bg-background/30 border border-foreground/15 rounded-md px-4 py-3 shadow-lg ring-1 ring-foreground/3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LuBookOpen className="w-5 h-5" />
            <span className="text-foreground font-semibold text-md">Kutoob</span>
          </div>
          <Link href="/sign-in">
            <Button variant="default" className="rounded-sm">
              Kirish
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
