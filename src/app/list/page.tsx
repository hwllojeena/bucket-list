'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Stars, Camera, Gift } from 'lucide-react';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';
import BucketList from '@/components/BucketList';
import { useBucketList } from '@/hooks/useBucketList';

export default function ListPage() {
    const {
        items,
        completedCount,
        handleComplete,
        completedVoucherIds,
        handleCompleteVoucher,
        isLoaded
    } = useBucketList();

    if (!isLoaded) return null;

    return (
        <main className="min-h-screen bg-background relative overflow-x-hidden p-4">
            <div className="max-w-6xl mx-auto pt-16 pb-40">
                {/* Navigation */}
                <div className="flex justify-start mb-16">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors italic font-medium">
                        <ArrowLeft size={18} /> Exit our universe
                    </Link>
                </div>

                {/* Header */}
                <header className="text-center mb-24 relative">

                    <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight">
                        Dear <span className="text-primary">Aldo,</span>
                    </h1>

                    <p className="text-muted-foreground max-w-lg mx-auto italic text-lg opacity-80">
                        A visual journey through our 50 adventures. <br />
                        Scroll down to explore our path...
                    </p>
                </header>

                {/* Progress Bar (Pinned but subtle) */}
                <div className="sticky top-4 z-40 mb-20 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-lg max-w-2xl mx-auto">
                    <ProgressBar current={completedCount} total={50} />
                </div>

                {/* Roadmap List */}
                <div className="relative">
                    <BucketList
                        items={items}
                        onComplete={handleComplete}
                        completedVoucherIds={completedVoucherIds}
                        onVoucherComplete={handleCompleteVoucher}
                    />
                </div>

                {/* Footer Celebration */}
                {completedCount === 50 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-32 p-12 glass-card rounded-[3rem] border-primary/20"
                    >
                        <Stars className="w-12 h-12 text-accent mx-auto mb-6 animate-spin-slow" />
                        <h2 className="text-4xl font-serif font-bold text-primary mb-4">Our Journey is Infinite</h2>
                        <p className="italic text-muted-foreground">Every end is just a new beginning for us. I love you, Aldo. ❤️</p>
                    </motion.div>
                )}
            </div>

            {/* Decorative BG */}
            <div className="fixed inset-0 pointer-events-none opacity-5 -z-10">
                <div className="absolute top-1/2 left-0 -translate-x-1/2 w-96 h-96 bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 translate-x-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
            </div>
        </main>
    );
}
