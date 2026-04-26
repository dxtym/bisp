"use client"

import { motion } from "motion/react"
import { LuWrench, LuChevronDown } from "react-icons/lu"
import { Badge } from "@/components/ui/badge"
import { SCROLLBAR_THIN } from "@/lib/constants/ui"

const SQL = "SELECT COUNT(*) AS total_users FROM users;"
const RESULT = JSON.stringify([{ total_users: 1247 }], null, 2)

interface Props {
  delay: number
}

export default function Uncollapsed({ delay }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="rounded border border-border text-sm bg-background/30"
    >
      <div className="flex w-full items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
          <LuWrench className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Ijrochi</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Tayyor
          </Badge>
          <LuChevronDown className="size-3 text-muted-foreground rotate-180" />
        </div>
      </div>
      <div className="border-t border-border p-2">
        <p className="mb-1 text-xs font-medium text-muted-foreground">Parametrlar</p>
        <pre className="overflow-x-auto rounded bg-muted/50 p-2 text-xs pb-3" style={SCROLLBAR_THIN}>
          <code className="block whitespace-pre">{SQL}</code>
        </pre>
      </div>
      <div className="border-t border-border p-2">
        <p className="mb-1 text-xs font-medium text-muted-foreground">Natija</p>
        <pre className="overflow-x-auto rounded bg-muted/50 p-2 text-xs pb-3" style={SCROLLBAR_THIN}>
          <code className="block whitespace-pre">{RESULT}</code>
        </pre>
      </div>
    </motion.div>
  )
}
