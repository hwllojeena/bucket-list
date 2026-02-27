'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import SequentialBucketList from '@/components/SequentialBucketList';
import { useBucketList } from '@/hooks/useBucketList';

export default function SequentialListPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const {
        items,
        tenant,
        completedCount,
        totalCount,
        handleComplete,
        isLoaded,
        error
    } = useBucketList(slug);

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
        <main className="min-h-screen bg-background relative overflow-x-hidden p-4">
            <div className="max-w-6xl mx-auto pt-16 pb-10">
                {/* Navigation */}
                <div className="flex justify-start mb-16">
                    <Link href={`/${slug}`} className="flex items-center gap-2 text-muted-foreground transition-colors font-medium hover:opacity-70">
                        <ArrowLeft size={18} /> Back to start
                    </Link>
                </div>

                {/* Header */}
                <header className="text-center mb-12 md:mb-24 relative">
                    <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight">
                        {tenant.heading_text.split(' ').map((word, i) => (
                            <span key={i} className={i === tenant.heading_text.split(' ').length - 1 ? "italic" : ""} style={{ color: i === tenant.heading_text.split(' ').length - 1 ? tenant.color_theme : undefined }}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto text-lg opacity-80 backdrop-blur-sm whitespace-pre-wrap">
                        {tenant.subheading_text}
                    </p>
                </header>

                {/* Progress Bar */}
                <div className="sticky top-4 z-40 mt-6 md:mt-12 mb-12 md:mb-28 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-lg max-w-2xl mx-auto">
                    <ProgressBar
                        current={completedCount}
                        total={totalCount}
                        progressText={tenant.progress_text}
                        themeColor={tenant.color_theme}
                    />
                </div>

                {/* The Sequential List */}
                <SequentialBucketList
                    items={items}
                    onComplete={handleComplete}
                    themeColor={tenant.color_theme}
                />
            </div>

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-5 -z-10">
                <div
                    className="absolute top-1/2 left-0 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px]"
                    style={{ backgroundColor: tenant.color_theme }}
                />
                <div
                    className="absolute bottom-0 right-0 translate-x-1/4 w-96 h-96 rounded-full blur-[120px]"
                    style={{ backgroundColor: tenant.color_theme }}
                />
            </div>
        </main>
    );
}
