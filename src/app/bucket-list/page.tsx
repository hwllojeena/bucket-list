'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';
import SequentialBucketList from '@/components/SequentialBucketList';
import { useBucketList } from '@/hooks/useBucketList';

export default function SequentialListPage() {
    const {
        items,
        completedCount,
        handleComplete,
        isLoaded
    } = useBucketList();

    if (!isLoaded) return null;

    return (
        <main className="min-h-screen bg-background relative overflow-x-hidden p-4">
            <div className="max-w-6xl mx-auto pt-16 pb-10">
                {/* Navigation */}
                <div className="flex justify-start mb-16">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors italic font-medium">
                        <ArrowLeft size={18} /> Back to start
                    </Link>
                </div>

                {/* Header */}
                <header className="text-center mb-24 relative">
                    <div className="inline-block p-3 rounded-full bg-primary/5 mb-6">
                        <Camera className="w-8 h-8 text-primary/40" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                        Our <span className="text-primary italic">Continuous</span> Path
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto italic text-lg opacity-80 backdrop-blur-sm">
                        No rewards, no chapters. <br />
                        Just the two of us and our 50 adventures...
                    </p>
                </header>

                {/* Progress Bar */}
                <div className="sticky top-4 z-40 mb-20 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-lg max-w-2xl mx-auto">
                    <ProgressBar current={completedCount} total={50} />
                </div>

                {/* The Sequential List */}
                <SequentialBucketList
                    items={items}
                    onComplete={handleComplete}
                />
            </div>

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-5 -z-10">
                <div className="absolute top-1/2 left-0 -translate-x-1/2 w-96 h-96 bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 translate-x-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
            </div>
        </main>
    );
}
