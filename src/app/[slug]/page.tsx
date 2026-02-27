'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import HeartLock from '@/components/HeartLock';
import { useBucketList } from '@/hooks/useBucketList';

export default function PasscodePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { tenant, isLoaded, error } = useBucketList(slug);

  const handleUnlock = () => {
    localStorage.setItem(`unlocked_${slug}`, 'true');
    router.push(`/${slug}/bucket-list`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-serif italic text-xl">Loading Universe...</div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">Universe Not Found</h1>
          <p className="text-muted-foreground">The journey you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg mt-20"
      >
        <HeartLock
          onUnlock={handleUnlock}
          correctCombination={tenant.passcode}
          lockText={tenant.lock_text}
          themeColor={tenant.color_theme}
        />

        <div className="mt-20 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-40">
            {tenant.hint || 'Hint: MM/DD'}
          </p>
        </div>
      </motion.div>
    </main>
  );
}
