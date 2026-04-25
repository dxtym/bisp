"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

const GRID = 3;

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => {
  const gap = Math.max(1, size / 16);
  const cell = (size - gap * (GRID - 1)) / GRID;

  return (
    <div
      className={cn("inline-grid", className)}
      style={{
        gridTemplateColumns: `repeat(${GRID}, ${cell}px)`,
        gridTemplateRows: `repeat(${GRID}, ${cell}px)`,
        gap,
      }}
      {...props}
    >
      {Array.from({ length: GRID * GRID }, (_, i) => {
        const row = Math.floor(i / GRID);
        const col = i % GRID;
        return (
          <motion.span
            key={i}
            className="block rounded-[2px] bg-current"
            style={{ width: cell, height: cell }}
            animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1, 0.7] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (row + col) * 0.12,
            }}
          />
        );
      })}
    </div>
  );
};
