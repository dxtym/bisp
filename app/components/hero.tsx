"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <motion.h1
        className="text-5xl font-bold tracking-tight"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        Siz Yozing - Biz Bajaramiz
      </motion.h1>
      <motion.p
        className="text-muted-foreground text-lg max-w-xl"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <span className="block leading-relaxed">
          Kutoob malumot tahlilini <span className="font-semibold">suniy intellekt</span> orqali
        </span>
        <span className="block leading-relaxed">
          <span className="font-semibold underline underline-offset-4 decoration-2">tezroq</span> va{" "}
          <span className="font-semibold underline underline-offset-4 decoration-2">osonroq</span> bajarish imkonini beradi.
        </span>
      </motion.p>
      <motion.div
        className="flex flex-col items-center gap-2"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button
              variant="secondary"
              className="px-8 rounded-sm bg-neutral-900 !text-white hover:bg-black dark:bg-white dark:!text-black dark:hover:bg-neutral-100"
            >
              Kirish
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="px-8 rounded-sm border border-neutral-300 bg-neutral-200 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:border-white/10 dark:bg-neutral-900 dark:text-white/60 dark:hover:bg-neutral-900 dark:hover:text-white"
            onClick={() => window.open("https://calendly.com", "_blank")}
          >
            Aloqa
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/80">
          Karta talab qilinmaydi
        </p>
      </motion.div>
      <motion.div
        className="flex flex-col items-center space-y-2 pt-20"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Hamkorlar
        </p>
        <div className="flex items-center gap-8 pt-3">
          <Image src="/wiut.jpeg" alt="wiut" width={40} height={40} className="object-contain" />
          <Image src="/a16z.png" alt="a16z" width={40} height={40} className="object-contain" />
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.9985 47.9994H0V8.61853e-07H47.9985V47.9994Z" fill="#FF6600"/>
            <path d="M13.9012 11.7843H17.6595L22.4961 21.5325C23.203 22.9836 23.7984 24.3976 23.7984 24.3976C23.7984 24.3976 24.4313 23.021 25.175 21.5325L30.0868 11.7843H33.5843L25.2865 27.3746V37.309H22.1244V27.1884L13.9012 11.7843Z" fill="white"/>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
