'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import HeartLock from '@/components/HeartLock';

export default function PasscodePage() {
  const router = useRouter();

  // Default combination: 1402 (Feb 14)
  // You can change this to any 4-digit combination!
  const combination = "1402";

  const handleUnlock = () => {
    router.push('/bucket-list');
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg mt-20"
      >
        <HeartLock onUnlock={handleUnlock} correctCombination={combination} />

        <div className="mt-20 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-40">
            Hint: MM/DD
          </p>
        </div>
      </motion.div>
    </main>
  );
}
