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
  originalPrice?: string
  featured?: boolean
  benefits: Benefit[]
  onClick?: () => void
  loading?: boolean
}

export default function PricingCard({
  name,
  price,
  originalPrice,
  featured = false,
  benefits,
  onClick,
  loading = false,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl border border-neutral-200 bg-white shadow-sm dark:bg-neutral-950 dark:border-white/10 px-6 py-6 space-y-4",
        "transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 dark:hover:shadow-white/5 dark:hover:border-white/20",
        featured && "shadow-[0_0_30px_rgba(0,0,0,0.06)] dark:shadow-[0_0_40px_rgba(255,255,255,0.04)]"
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{name}</h2>
          {featured && (
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:border-white/10">
              Tavsiya
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-sm text-muted-foreground">so&apos;m</span>
        </div>
        <p className={cn("text-lg text-neutral-400 line-through dark:text-neutral-500", !originalPrice && "invisible")}>
          {originalPrice} so&apos;m
        </p>
      </div>
      <hr className="border-border" />
      <ul className="space-y-2">
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
          "w-full border border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
          "dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        )}
        onClick={onClick}
        disabled={loading}
      >
        {loading ? "Yuklanmoqda..." : "Tanlash"}
      </Button>
    </div>
  )
}
