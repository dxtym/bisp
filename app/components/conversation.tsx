"use client"

import { motion } from "motion/react"
import Collapsed from "@/components/collapsed"
import Uncollapsed from "@/components/uncollapsed"

const D = {
  user:       0.2,
  tarjimon:   0.9,
  mutafakkir: 1.4,
  ijrochi:    1.9,
  assistant:  2.5,
}

export default function Conversation() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: D.user, duration: 0.4, ease: "easeOut" }}
        className="ml-auto bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-base max-w-[85%] w-fit mb-2"
      >
        Jami foydalanuvchilar nechta?
      </motion.div>
      <Collapsed name="Tarjimon" delay={D.tarjimon} />
      <Collapsed name="Mutafakkir" delay={D.mutafakkir} />
      <Uncollapsed delay={D.ijrochi} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: D.assistant, duration: 0.4, ease: "easeOut" }}
        className="text-base text-foreground/90"
      >
        Jami <strong>1 247</strong> ta foydalanuvchi topildi.
      </motion.div>
    </div>
  )
}
