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
                                            whileHover={!item.locked ? { scale: 1.05, rotate: item.id % 2 === 0 ? 2 : -2 } : {}}
                                            className={`relative group mx-auto w-full max-w-[320px] transition-all duration-500 ${item.locked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                                        >
                                            {/* Base Card Shadow & Paper Feel */}
                                            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-0 relative overflow-hidden flex flex-col h-full border border-zinc-100">

                                                {/* Photo Section (Top Square) */}
                                                <div className="relative w-full aspect-square bg-zinc-50 overflow-hidden">
                                                    {/* The uploaded photo */}
                                                    {item.photoUrl ? (
                                                        <motion.img
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            src={item.photoUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        /* Camera/Upload Placeholder */
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-zinc-300">
                                                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center mb-4">
                                                                <Camera className="w-8 h-8 opacity-20" />
                                                            </div>
                                                            <button
                                                                onClick={() => !item.locked && handleUploadClick(item.id)}
                                                                className="heart-gradient text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                Add Photo
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Polaroid Template Overlay for textures and cutout edges */}
                                                    <img
                                                        src="/images/polaroid-template-transparent.png"
                                                        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-90 shadow-inner"
                                                        alt=""
                                                    />
                                                </div>

                                                {/* Text Section (Bottom White Area) */}
                                                <div className="p-4 md:p-6 pb-8 text-center flex-1 flex flex-col justify-center min-h-[100px] bg-white relative">
                                                    {/* Subtle Grain Texture Over Text Area */}
                                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                                                    <div className="relative">
                                                        <div className="flex items-center justify-center gap-1 mb-1 opacity-40">
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">#{item.id}</span>
                                                            {item.completed && <Sparkles className="w-3 h-3 text-primary animate-pulse" />}
                                                        </div>
                                                        <h3 className={`text-2xl md:text-3xl font-indie text-zinc-800 leading-tight ${item.locked ? 'text-zinc-400' : ''}`}>
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Completion Checkmark Badge (Floating) */}
                                            {item.completed && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full heart-gradient flex items-center justify-center text-white shadow-lg z-20 border-2 border-white"
                                                >
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </motion.div>
                                            )}
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
