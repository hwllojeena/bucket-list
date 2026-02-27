'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
            >
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                        <Heart className="w-12 h-12 text-primary fill-primary" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight">
                    A private digital space made <span className="text-primary italic">just for you.</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                    Personalized bucket list websites crafted for birthdays, anniversaries, or just because they mean everything to you.
                </p>

                <div className="flex justify-center">
                    <a
                        href="https://www.tiktok.com/@jeenaworks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="heart-gradient text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        Create Your Own
                    </a>
                </div>
            </motion.div>

            <footer className="absolute bottom-8 left-0 right-0 text-center text-xs text-muted-foreground uppercase tracking-widest opacity-40 font-bold">
                Powered by Jeenaworks
            </footer>
        </main>
    );
}
