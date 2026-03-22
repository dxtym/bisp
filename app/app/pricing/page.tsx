"use client"

import { motion } from "motion/react"
import Footer from "@/components/footer"
import PricingCard from "@/components/card"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
}

const plans = [
  {
    name: "Pro",
    price: "99,000",
    period: "so'm/oy",
    featured: false,
    benefits: [
      { label: "So'rovlar", value: "50 ta/kun" },
      { label: "Javob tezligi", value: "Tezlashtirilgan" },
      { label: "Ustuvorlik", value: "Standart" },
      { label: "Qo'llab-quvvatlash", value: "Email" },
    ],
  },
  {
    name: "Max",
    price: "299,000",
    period: "so'm/oy",
    featured: true,
    benefits: [
      { label: "So'rovlar", value: "Cheksiz" },
      { label: "Javob tezligi", value: "Eng tez" },
      { label: "Ustuvorlik", value: "Yuqori ustuvorlik" },
      { label: "Qo'llab-quvvatlash", value: "Qo'ng'iroq + Email" },
    ],
  },
  {
    name: "Team",
    price: "799,000",
    period: "so'm/oy",
    featured: false,
    benefits: [
      { label: "Foydalanuvchilar", value: "10 tagacha" },
      { label: "So'rovlar", value: "Cheksiz" },
      { label: "Boshqaruv paneli", value: "Korporativ" },
      { label: "Qo'llab-quvvatlash", value: "Shaxsiy menejer" },
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="relative min-h-screen text-foreground">
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
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <motion.h1
              className="text-4xl font-bold tracking-tight"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Tariflar
            </motion.h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2 + i}
                className="flex-1"
              >
                <PricingCard {...plan} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 z-50 py-5">
        <Footer />
      </footer>
    </div>
  )
}
