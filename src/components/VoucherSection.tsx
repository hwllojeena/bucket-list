'use client';

import { motion } from 'framer-motion';
import { Gift, Ticket, Heart, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export interface Voucher {
    id: number;
    title: string;
    description: string;
    code: string;
}

export const vouchers: Voucher[] = [
    { id: 1, title: 'Food Date Night', description: 'Redeem for a fancy dinner date anywhere you want.', code: 'DATE-2026' },
    { id: 2, title: 'Movie Marathon', description: 'One night of movies, popcorn, and cuddles.', code: 'CUDDLE-MAX' },
    { id: 3, title: 'Weekend Getaway', description: 'A surprise trip to a cozy destination.', code: 'TRIP-LOVE' },
    { id: 4, title: 'Spa & Relax', description: 'A full day of relaxation and pampering.', code: 'RELAX-SPA' },
    { id: 5, title: 'Home Cooked Special', description: 'I will cook your favorite 3-course meal.', code: 'CHEF-LOVE' },
    { id: 6, title: 'Adventure Park', description: 'A thrill-seeking day at an adventure park.', code: 'THRILL-ME' },
    { id: 7, title: 'Starry Beach Night', description: 'A quiet evening with stars and waves.', code: 'STARRY-LOVE' },
    { id: 8, title: 'Surprise Gift', description: 'A thoughtful surprise chosen just for you.', code: 'SURPRISE-U' },
    { id: 9, title: 'Breakfast in Bed', description: 'A lazy morning with your favorite breakfast.', code: 'MORNING-JOY' },
    { id: 10, title: 'Final Anniversary Trip', description: 'A grand celebration of our journey.', code: 'FINAL-LEG' },
];

export interface VoucherCardProps {
    voucher: Voucher;
    isLocked: boolean;
    isUsed?: boolean;
    onUse?: () => void;
}

export function VoucherCard({ voucher, isLocked, isUsed, onUse }: VoucherCardProps) {
    const handleUse = () => {
        if (onUse) onUse();
        confetti({ particleCount: 50, spread: 40, colors: ['#ffd700'] });
    };
    return (
        <motion.div
            whileHover={!isLocked ? { scale: 1.05 } : {}}
            className={`relative w-full max-w-sm mx-auto ${isLocked ? 'opacity-40 grayscale' : ''}`}
        >
            <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-primary/30 p-6 rounded-2xl shadow-xl overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full" />
                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-accent/5 rounded-full" />

                <div className="flex items-center gap-3 mb-4">
                    <Ticket className={`w-6 h-6 ${isLocked ? 'text-muted-foreground' : 'text-primary'}`} />
                    <span className="font-bold tracking-widest text-xs uppercase text-primary/60">Milestone Reward</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-zinc-800 dark:text-zinc-100 mb-2">{voucher.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 h-12 leading-relaxed">
                    {isLocked ? "Complete the next 5 adventures to unlock this gift..." : voucher.description}
                </p>

                <div className="pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    {!isLocked ? (
                        <>
                            <div className="bg-primary/10 px-3 py-1 rounded-md">
                                <span className="font-mono text-sm font-bold text-primary">{voucher.code}</span>
                            </div>
                            {isUsed ? (
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <CheckCircle2 className="w-5 h-5" /> Claimed
                                </div>
                            ) : (
                                <button
                                    onClick={handleUse}
                                    className="heart-gradient text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    Completed <CheckCircle2 className="w-4 h-4" />
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
                            <Lock className="w-4 h-4" /> Mystery Gift
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function VoucherSection({ isVisible, milestoneCount = 10 }: { isVisible: boolean, milestoneCount?: number }) {
    const earnedVouchers = vouchers.slice(0, milestoneCount);

    if (!isVisible) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {earnedVouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} isLocked={false} />
            ))}
        </div>
    );
}
