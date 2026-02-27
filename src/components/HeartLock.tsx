'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface HeartLockProps {
    onUnlock: () => void;
    correctCombination: string;
    lockText?: string;
    themeColor?: string;
}

export default function HeartLock({
    onUnlock,
    correctCombination,
    lockText = "The Day We Got Together",
    themeColor = "#d4145a"
}: HeartLockProps) {
    const [digits, setDigits] = useState([0, 0, 0, 0]);
    const [isError, setIsError] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const adjustDigit = (index: number, delta: number) => {
        setDigits(prev => {
            const next = [...prev];
            next[index] = (next[index] + delta + 10) % 10;
            return next;
        });
    };

    useEffect(() => {
        const currentCombination = digits.join('');
        if (currentCombination === correctCombination) {
            setIsUnlocked(true);
            const timer = setTimeout(() => {
                onUnlock();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [digits, correctCombination, onUnlock]);

    return (
        <div className="relative flex flex-col items-center">
            <motion.div
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="relative mb-12"
            >
                {/* The Lock Graphic */}
                <div className="relative w-96 h-96 flex items-center justify-center scale-100 md:scale-110">
                    {/* Shackle */}
                    <motion.div
                        animate={isUnlocked ? { y: -40, rotate: -15 } : {}}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 border-[16px] border-zinc-300 rounded-t-full -z-10"
                    />

                    {/* Heart Body */}
                    <div className="heart-lock-body w-full h-full relative drop-shadow-2xl">
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full translate-y-10">
                            <defs>
                                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={themeColor} />
                                    <stop offset="100%" stopColor={themeColor} />
                                </linearGradient>
                                <filter id="innerShadow">
                                    <feOffset dx="2" dy="2" />
                                    <feGaussianBlur stdDeviation="3" result="offset-blur" />
                                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                                    <feFlood floodColor="black" floodOpacity="0.3" result="color" />
                                    <feComponentTransfer in="shadow">
                                        <feFuncA type="linear" slope="0.5" />
                                    </feComponentTransfer>
                                </filter>
                            </defs>
                            <path d="M100 183.5C100 183.5 15.5 125 15.5 68.5C15.5 38.5 39.5 14.5 69.5 14.5C87.5 14.5 100 25.5 100 25.5C100 25.5 112.5 14.5 130.5 14.5C160.5 14.5 184.5 38.5 184.5 68.5C184.5 125 100 183.5 100 183.5Z"
                                fill="url(#heartGradient)"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="5"
                            />
                        </svg>

                        {/* Text overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16">
                            <h2 className="text-white text-lg font-serif italic mb-6 drop-shadow-md px-12 text-center">
                                {lockText}
                            </h2>

                            {/* Combination Dials */}
                            <div className="flex gap-2">
                                {digits.map((digit, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <button
                                            onClick={() => adjustDigit(i, 1)}
                                            className="p-1 text-white opacity-50 hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronUp size={20} />
                                        </button>

                                        <div className="w-10 h-14 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-inner border border-white/50">
                                            <motion.span
                                                key={digit}
                                                initial={{ y: -5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="text-2xl font-bold"
                                                style={{ color: themeColor }}
                                            >
                                                {digit}
                                            </motion.span>
                                        </div>

                                        <button
                                            onClick={() => adjustDigit(i, -1)}
                                            className="p-1 text-white opacity-50 hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronDown size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isUnlocked && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-2 mt-4"
                    >
                        <div className="flex items-center gap-2 font-bold" style={{ color: themeColor }}>
                            <Sparkles className="animate-pulse" />
                            <span>Correct! Unlocking...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
