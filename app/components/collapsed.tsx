"use client"

import { motion } from "motion/react"
import { LuWrench, LuChevronDown } from "react-icons/lu"
import { Badge } from "@/components/ui/badge"

interface Props {
  name: string
  delay: number
}

export default function Collapsed({ name, delay }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex w-full items-center justify-between gap-2 rounded border border-border p-2 text-sm bg-background/30"
    >
      <div className="flex items-center gap-2">
        <LuWrench className="size-3.5 text-muted-foreground" />
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="gap-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Tayyor
        </Badge>
        <LuChevronDown className="size-3 text-muted-foreground" />
      </div>
    </motion.div>
  )
}
