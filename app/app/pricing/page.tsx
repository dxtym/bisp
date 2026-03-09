"use client"

import { motion } from "motion/react"
import { LuCheck } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

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
    price: "$9",
    period: "/oy",
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
    price: "$29",
    period: "/oy",
    featured: true,
    benefits: [
      { label: "So'rovlar", value: "Cheksiz" },
      { label: "Javob tezligi", value: "Eng tez" },
      { label: "Ustuvorlik", value: "Yuqori ustuvorlik" },
      { label: "Qo'llab-quvvatlash", value: "Qo'ng'iroq + Email" },
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="fixed top-[10%] bottom-[10%] left-[20%] right-[20%] -z-10">
        <div
          className="h-full w-full"
          style={{
            backgroundSize: "50px 50px",
            backgroundImage: `
              linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)
            `,
            maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
          }}
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar showSignIn={false} />
      </header>

      <main className="min-h-screen flex items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-3xl mx-auto">
          <div className="mb-10 text-center space-y-2">
            <motion.h1
              className="text-4xl font-bold tracking-tight"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Tariflar
            </motion.h1>
            <motion.p
              className="text-sm text-muted-foreground"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              O&apos;zingizga mos tarifni tanlang
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2 + i}
                className={`flex-1 rounded-xl border bg-muted p-6 space-y-6 ${
                  plan.featured
                    ? "border-border/60 shadow-[0_0_30px_rgba(0,0,0,0.08)] dark:shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                    : "border-border"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{plan.name}</h2>
                    {plan.featured && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Tavsiya etiladi
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <hr className="border-border" />

                <ul className="space-y-3">
                  {plan.benefits.map((b) => (
                    <li key={b.label} className="flex items-center gap-2 text-sm">
                      <LuCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{b.label}:</span>
                      <span className="font-medium">{b.value}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="secondary"
                  className="w-full border border-border hover:border-border/70"
                >
                  {plan.name} ni tanlash
                </Button>
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
