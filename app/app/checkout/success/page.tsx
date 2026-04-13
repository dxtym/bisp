"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { CircleCheck } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="relative min-h-screen text-foreground flex items-center justify-center px-4">
      <div className="fixed top-[10%] bottom-[10%] left-[20%] right-[20%] -z-10 pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundSize: "50px 50px",
            backgroundImage: `
              linear-gradient(to right, rgb(120 120 120 / 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(120 120 120 / 0.15) 1px, transparent 1px)
            `,
            maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
          }}
        />
      </div>
      <motion.div
        className="text-center space-y-6 max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CircleCheck className="h-16 w-16 text-emerald-500 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">To'lov muvaffaqiyatli!</h1>
          <p className="text-muted-foreground">
            Obunangiz faollashtirildi. Barcha imkoniyatlardan foydalanishingiz mumkin.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
