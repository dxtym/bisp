import { LuCheck } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Benefit = {
  label: string
  value: string
}

type PricingCardProps = {
  name: string
  price: string
  period: string
  featured?: boolean
  benefits: Benefit[]
}

export default function PricingCard({
  name,
  price,
  period,
  featured = false,
  benefits,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-sm dark:bg-zinc-900/50 dark:border-border p-6 space-y-6",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-zinc-300 dark:hover:shadow-white/10 dark:hover:border-white/30",
        featured
          ? "shadow-[0_0_30px_rgba(0,0,0,0.06)] dark:border-border/60 dark:shadow-[0_0_30px_rgba(255,255,255,0.06)]"
          : "dark:border-border"
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{name}</h2>
          {featured && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              Tavsiya
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
      </div>
      <hr className="border-border" />
      <ul className="space-y-3">
        {benefits.map((b) => (
          <li key={b.label} className="flex items-center gap-2 text-sm">
            <LuCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="text-muted-foreground">{b.label}:</span>
            <span className="font-medium">{b.value}</span>
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        className={cn(
          "w-full border border-zinc-200 transition-colors duration-200",
          "hover:border-zinc-300 hover:bg-zinc-50",
          "dark:border-border dark:bg-white dark:text-zinc-900 dark:hover:border-border/70 dark:hover:bg-white/90"
        )}
      >
        Tanlash
      </Button>
    </div>
  )
}
