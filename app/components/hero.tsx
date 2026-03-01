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
    <div className="flex flex-col items-center text-center space-y-10">
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
          <span className="font-semibold underline underline-offset-4 decoration-2">tezroq</span> va <span className="font-semibold underline underline-offset-4 decoration-2">osonroq</span> bajarish imkonini beradi.
        </span>
      </motion.p>
      <motion.div
        className="flex flex-row gap-4 pt-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <Link href="/sign-in">
          <Button variant="default" size="lg" className="px-8 border border-neutral-600 hover:border-neutral-500">
            Kirish
          </Button>
        </Link>
        <Button
          variant="secondary"
          size="lg"
          className="px-8 border border-neutral-500 hover:border-neutral-600"
          onClick={() => window.open("https://calendly.com", "_blank")}
        >
          Aloqa
        </Button>
      </motion.div>
      <motion.div
        className="pt-16 flex flex-col items-center space-y-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <p className="text-sm text-neutral-500 uppercase tracking-wider">
          Hamkorlar
        </p>
        <div className="flex flex-row items-center gap-8 pt-3 opacity-100">
          <Image src="/wiut.jpeg" alt="wiut" width={50} height={50} className="object-contain" />
        </div>
      </motion.div>
    </div>
  );
}
