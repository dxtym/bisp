"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import Footer from "@/components/footer"
import PricingCard from "@/components/card"
import UserAvatar from "@/components/avatar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" as const },
  }),
}

const plans = [
  {
    slug: "pro",
    name: "Pro",
    price: 99000,
    featured: false,
    benefits: [
      { label: "So'rovlar", value: "50 ta/kun" },
      { label: "Javob tezligi", value: "Tezlashtirilgan" },
      { label: "Ustuvorlik", value: "Standart" },
      { label: "Qo'llab-quvvatlash", value: "Email" },
    ],
  },
  {
    slug: "max",
    name: "Max",
    price: 299000,
    featured: true,
    benefits: [
      { label: "So'rovlar", value: "Cheksiz" },
      { label: "Javob tezligi", value: "Eng tez" },
      { label: "Ustuvorlik", value: "Yuqori ustuvorlik" },
      { label: "Qo'llab-quvvatlash", value: "Qo'ng'iroq + Email" },
    ],
  },
  {
    slug: "team",
    name: "Team",
    price: 799000,
    featured: false,
    benefits: [
      { label: "Foydalanuvchilar", value: "10 tagacha" },
      { label: "So'rovlar", value: "Cheksiz" },
      { label: "Boshqaruv paneli", value: "Korporativ" },
      { label: "Qo'llab-quvvatlash", value: "Shaxsiy menejer" },
    ],
  },
]

const faqs = [
  {
    question: "To'lov qanday amalga oshiriladi?",
    answer: "To'lov Stripe orqali xavfsiz tarzda amalga oshiriladi. Bank kartasi orqali to'lash mumkin.",
  },
  {
    question: "Obunani istalgan vaqt bekor qilish mumkinmi?",
    answer: "Ha, obunani istalgan vaqtda bekor qilishingiz mumkin. Joriy to'lov davri tugaguncha albatta.",
  },
  {
    question: "Yillik rejimda qanday chegirma olaman?",
    answer: "Yillik to'lovda chegirma beriladi. Bu oylik to'lovga nisbatan sezilarli tejash imkonini beradi.",
  },
]

const toggleItemClass =
  "px-5 py-1.5 text-sm rounded-md data-[state=on]:bg-black/8 data-[state=on]:text-foreground text-muted-foreground dark:data-[state=on]:bg-white/10"

function formatPrice(n: number) {
  return n.toLocaleString("en-US")
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const { data: session } = useSession()

  async function handleSelect(slug: string) {
    if (loadingPlan) return
    setLoadingPlan(slug)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: slug }),
      })
      const data = await res.json()
      if (data.data?.url) window.location.href = data.data.url
    } catch {
      setLoadingPlan(null)
    }
  }

  const isYearly = billing === "yearly"

  return (
    <div className="relative min-h-screen flex flex-col text-foreground">
      <main className="flex-1 flex flex-col px-4 pt-8 pb-6">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-5" />
              Orqaga
            </Link>
            <UserAvatar name={session?.user?.name} image={session?.user?.image} />
          </div>

          <div className="text-center space-y-3">
            <motion.h1
              className="text-3xl font-bold tracking-tight"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Tariflar
            </motion.h1>
            <motion.div className="flex justify-center" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              <ToggleGroup
                type="single"
                value={billing}
                onValueChange={(v) => v && setBilling(v as "monthly" | "yearly")}
                variant="outline"
                className="border border-black/10 rounded-lg p-1 gap-1 dark:border-white/10"
              >
                <ToggleGroupItem value="monthly" className={toggleItemClass}>Oylik</ToggleGroupItem>
                <ToggleGroupItem value="yearly" className={toggleItemClass}>Yillik</ToggleGroupItem>
              </ToggleGroup>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2 + i}
                className="flex-1"
              >
                <PricingCard
                  {...plan}
                  price={isYearly ? formatPrice(Math.round(plan.price * 12 * 0.7)) : formatPrice(Math.round(plan.price * 0.9))}
                  originalPrice={isYearly ? formatPrice(plan.price * 12) : formatPrice(plan.price)}
                  onClick={() => handleSelect(plan.slug)}
                  loading={loadingPlan === plan.slug}
                />
              </motion.div>
            ))}
          </div>

          <motion.div className="space-y-3" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <div className="max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-center">FAQ</h2>
              <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-foreground/80">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="py-3">
        <Footer />
      </footer>
    </div>
  )
}
