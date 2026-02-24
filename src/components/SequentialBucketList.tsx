'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface BucketListItem {
    id: number;
    title: string;
    completed: boolean;
    photoUrl?: string | null;
    locked?: boolean;
}

interface SequentialBucketListProps {
    items: BucketListItem[];
    onComplete: (id: number, photo: string) => void;
}

export default function SequentialBucketList({ items, onComplete }: SequentialBucketListProps) {
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

    return (
        <div className="relative max-w-6xl mx-auto px-4 pb-20">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Scoped Journey Grid Area (Line stops here) */}
            <div className="relative">
                {/* Central Path Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-4 border-dashed border-primary/10 -translate-x-1/2 hidden md:block" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-16 relative z-10 pt-10">
                    {items.map((item, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div
                                key={item.id}
                                className={`
                                    flex flex-col items-center
                                    ${isEven ? 'md:translate-x-12' : 'md:-translate-x-12 md:mt-24'}
                                `}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 30, rotate: (item.id % 7 - 3) * 0.2 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (Math.floor(index / 2) % 5) * 0.1 + (index % 2 === 0 ? 0 : 0.15) }}
                                    animate={{ rotate: (item.id % 7 - 3) * 0.2 }}
                                    whileHover={!item.locked ? { scale: 1.05, rotate: item.id % 2 === 0 ? 1 : -1 } : {}}
                                    className={`relative w-full max-w-[420px] transition-all duration-500 ${item.locked ? 'grayscale blur-[1px] pointer-events-none' : ''}`}
                                >
                                    {/* Polaroid Card */}
                                    <div className="bg-[#fdfdfd] shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-4 md:p-5 pb-8 md:pb-12 flex flex-col group relative overflow-hidden border border-zinc-100/50 rounded-sm">

                                        {/* Paper Texture */}
                                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                                        <div className={`flex flex-col h-full ${item.locked ? 'opacity-40' : ''}`}>
                                            {/* Photo Area */}
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
                                                        <span className="text-xs font-sans tracking-tight text-white/20 uppercase group-hover:text-white/40 transition-colors">upload photo here</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none opacity-40" />
                                            </div>

                                            {/* Title Area */}
                                            <div className="mt-8 md:mt-12 flex-1 flex items-center justify-center text-center px-4">
                                                <h3 className={`text-xl md:text-2xl font-indie text-[#ef4444] leading-tight break-words ${item.locked ? 'text-zinc-400' : ''}`}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Completion Checkmark */}
                                        {item.completed && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -20 }}
                                                animate={{ scale: 1, rotate: -15 }}
                                                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary z-20 shadow-sm"
                                            >
                                                <CheckCircle2 className="w-6 h-6" />
                                            </motion.div>
                                        )}

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
            </div>

            {/* Final sentimental message - Now outside the grid's line scope */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 md:mt-60 pb-10 text-center relative"
            >
                {/* Short vertical connector leading to the quote */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-60 border-l-4 border-dashed border-primary/10 hidden md:block" />
                <p className="font-sans text-lg text-muted-foreground">
                    and the journey goes on...
                </p>
            </motion.div>
        </div>
    );
}
