'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-2 pb-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-primary font-serif text-lg tracking-wide">Gina & Aldo's Journey</span>
        <span className="text-primary font-bold">{current} / {total}</span>
      </div>
      <div className="h-4 w-full bg-secondary rounded-full overflow-hidden border border-border">
        <motion.div
          className="h-full heart-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
