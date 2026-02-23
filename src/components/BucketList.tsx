'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, Lock, Sparkles, Gift, Heart } from 'lucide-react';
import { VoucherCard, vouchers } from './VoucherSection';

export interface BucketListItem {
    id: number;
    title: string;
    completed: boolean;
    photoUrl?: string | null;
    locked?: boolean;
}

interface BucketListProps {
    items: BucketListItem[];
    onComplete: (id: number, photo: string) => void;
    completedVoucherIds: number[];
    onVoucherComplete: (id: number) => void;
}

export default function BucketList({ items, onComplete, completedVoucherIds, onVoucherComplete }: BucketListProps) {
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = (id: number) => {
        setUploadingId(id);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingId !== null) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    onComplete(uploadingId, compressedDataUrl);
                    setUploadingId(null);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    // Group items by milestones (5 items each)
    const milestoneIslands = Array.from({ length: 10 }, (_, i) => {
        return items.slice(i * 5, (i + 1) * 5);
    });

    return (
        <div className="relative max-w-6xl mx-auto px-4 pb-40">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Scoped Journey Container (Line stops here) */}
            <div className="relative">
                {/* Main Path Connector */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-4 border-dashed border-primary/10 -translate-x-1/2 hidden md:block" />

                {milestoneIslands.map((islandItems, islandIndex) => {
                    const isLocked = islandIndex > 0 && items.slice((islandIndex - 1) * 5, islandIndex * 5).some(i => !i.completed);
                    const isCompleted = islandItems.every(i => i.completed);

                    return (
                        <motion.section
                            key={`island-${islandIndex}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className={`relative ${islandIndex === milestoneIslands.length - 1 ? 'mb-0' : 'mb-32 md:mb-56'} ${isLocked ? 'grayscale blur-[1px]' : ''}`}
                        >
                            {/* Island Header */}
                            <div className="text-center mb-12 relative">
                                <div className="inline-block px-6 py-2 rounded-full heart-gradient text-white text-xs font-bold tracking-widest uppercase mb-4 shadow-lg">
                                    Chapter {islandIndex + 1}
                                </div>
                            </div>

                            {/* Island Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 md:gap-y-8 relative z-10">
                                {islandItems.map((item, itemIdx) => {
                                    const isLastInIsland = itemIdx === 4;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`
                                            ${isLastInIsland ? 'md:col-span-2 md:max-w-xl md:mx-auto w-full mt-4 md:mt-4' : ''}
                                            ${!isLastInIsland && itemIdx % 2 === 0 ? 'md:-mt-4 md:translate-x-12' : ''}
                                            ${!isLastInIsland && itemIdx % 2 !== 0 ? 'md:mt-4 md:-translate-x-12' : ''}
                                        `}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 30, rotate: (item.id % 7 - 3) * 0.2 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: (Math.floor(itemIdx / 2) % 3) * 0.1 + (itemIdx % 2 === 0 ? 0 : 0.15) }}
                                                animate={{ rotate: (item.id % 7 - 3) * 0.2 }}
                                                whileHover={!item.locked ? { scale: 1.05, rotate: item.id % 2 === 0 ? 1 : -1 } : {}}
                                                className={`relative mx-auto w-full max-w-[400px] transition-all duration-500 ${item.locked ? 'grayscale pointer-events-none' : ''}`}
                                            >
                                                {/* Physical Polaroid Card (Pure CSS) */}
                                                <div className="bg-[#fdfdfd] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-4 md:p-5 pb-6 md:pb-10 flex flex-col group relative overflow-hidden border border-zinc-100/50 rounded-sm">

                                                    {/* Subtle Paper Texture Overlay */}
                                                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                                                    {/* Content Wrapper (Muted when locked) */}
                                                    <div className={`flex flex-col h-full ${item.locked ? 'opacity-40' : ''}`}>
                                                        {/* Photo Area (Perfect Square) */}
                                                        <div className="relative w-full aspect-square bg-[#332e2e] overflow-hidden shadow-inner flex items-center justify-center">
                                                            {item.photoUrl ? (
                                                                <motion.img
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    src={item.photoUrl}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center p-8 text-center cursor-pointer" onClick={() => !item.locked && handleUploadClick(item.id)}>
                                                                    <span className="text-sm md:text-base font-sans tracking-tight text-white/20 uppercase group-hover:text-white/40 transition-colors">upload photo here</span>
                                                                </div>
                                                            )}

                                                            {/* Inset Shadow to simulate the cutout depth */}
                                                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none opacity-40" />
                                                        </div>

                                                        {/* Task Title Section (The thick bottom frame area) */}
                                                        <div className="mt-6 md:mt-10 flex-1 flex items-center justify-center text-center px-2">
                                                            <h3 className={`text-xl md:text-2xl font-indie text-[#ef4444] leading-tight break-words ${item.locked ? 'text-zinc-400' : ''}`}>
                                                                {item.title}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {/* Floating Completion Stamp/Badge */}
                                                    {item.completed && (
                                                        <motion.div
                                                            initial={{ scale: 0, rotate: -20 }}
                                                            animate={{ scale: 1, rotate: -15 }}
                                                            className="absolute top-2 right-2 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary z-20 shadow-sm"
                                                        >
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </motion.div>
                                                    )}

                                                    {/* Hidden Upload Button Cover (when no photo) */}
                                                    {!item.locked && (
                                                        <button
                                                            onClick={() => handleUploadClick(item.id)}
                                                            className="absolute inset-0 w-full h-full z-40 opacity-0 cursor-pointer"
                                                        />
                                                    )}
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Island Reward Station */}
                            <div className="mt-20 flex flex-col items-center relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-20 border-l-2 border-dashed border-primary/20 hidden md:block" />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="z-20 w-full max-w-md"
                                >

                                    <VoucherCard
                                        voucher={vouchers[islandIndex]}
                                        isLocked={!isCompleted}
                                        isUsed={completedVoucherIds.includes(vouchers[islandIndex].id)}
                                        onUse={() => onVoucherComplete(vouchers[islandIndex].id)}
                                    />
                                </motion.div>

                                {/* Connection to next island */}
                                {islandIndex < 9 && (
                                    <div className="mt-20 w-1 h-32 border-l-4 border-dashed border-primary/10 hidden md:block" />
                                )}
                            </div>
                        </motion.section>
                    );
                })}
            </div>

            {/* Final sentimental message - Floating below the path */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-60 pb-10 text-center relative"
            >
                {/* Short vertical connector leading to the quote */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-60 border-l-4 border-dashed border-primary/10 hidden md:block" />

                <p className="font-serif text-xl md:text-2xl text-[#ef4444]/60">
                    and the journey goes on...
                </p>
            </motion.div>
        </div>
    );
}
