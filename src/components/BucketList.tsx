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
                        className={`relative mb-32 md:mb-56 ${isLocked ? 'opacity-50 grayscale blur-[1px]' : ''}`}
                    >
                        {/* Island Header */}
                        <div className="text-center mb-12 relative">
                            <div className="inline-block px-6 py-2 rounded-full heart-gradient text-white text-xs font-bold tracking-widest uppercase mb-4 shadow-lg">
                                Adventure Set {islandIndex + 1}
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
                                            ${!isLastInIsland && itemIdx % 2 === 0 ? 'md:-mt-4' : ''}
                                            ${!isLastInIsland && itemIdx % 2 !== 0 ? 'md:mt-4' : ''}
                                        `}
                                    >
                                        <motion.div
                                            whileHover={!item.locked ? { scale: 1.02, rotate: islandIndex % 2 === 0 ? 1 : -1 } : {}}
                                            className={`glass-card rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden transition-all duration-500 border-2 ${item.completed ? 'border-primary/40 bg-primary/5' :
                                                item.locked ? 'border-transparent opacity-60' : 'border-white/50 shadow-xl'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                                            Memory {item.id}
                                                        </span>
                                                        {item.locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                                                    </div>
                                                    <h3 className={`text-xl md:text-2xl font-serif font-bold text-primary leading-tight mb-2 ${item.locked ? 'text-muted-foreground' : ''}`}>
                                                        {item.title}
                                                    </h3>
                                                </div>

                                                <div className="shrink-0">
                                                    {item.completed ? (
                                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/10">
                                                            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => !item.locked && handleUploadClick(item.id)}
                                                            disabled={item.locked}
                                                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${item.locked ? 'bg-zinc-200 dark:bg-zinc-800' : 'heart-gradient hover:scale-110 active:scale-95'
                                                                }`}
                                                        >
                                                            <Camera className="w-6 h-6 md:w-7 md:h-7" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {item.photoUrl && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        className="mt-6 rounded-3xl overflow-hidden border-4 border-white shadow-2xl rotate-1 group"
                                                    >
                                                        <img
                                                            src={item.photoUrl}
                                                            alt={item.title}
                                                            className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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
    );
}
