'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface BucketListItem {
    id: string | number;
    title: string;
    completed: boolean;
    photoUrl?: string | null;
}

interface SequentialBucketListProps {
    items: BucketListItem[];
    onComplete: (id: string | number, photo: string) => void;
    themeColor?: string;
}

export default function SequentialBucketList({
    items,
    onComplete,
    themeColor = "#ef4444"
}: SequentialBucketListProps) {
    const [uploadingId, setUploadingId] = useState<string | number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = (id: string | number) => {
        setUploadingId(id);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingId !== null) {
            setIsUploading(true);
            try {
                const reader = new FileReader();
                const imageDataUrl = await new Promise<string>((resolve) => {
                    reader.onload = (event) => resolve(event.target?.result as string);
                    reader.readAsDataURL(file);
                });

                const compressedBlob = await new Promise<Blob>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 1200; // Increased quality for storage
                        const MAX_HEIGHT = 1200;
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
                        canvas.toBlob((blob) => resolve(blob!), 'image/webp', 0.8);
                    };
                    img.src = imageDataUrl;
                });

                // Upload to Supabase Storage
                const fileName = `${uploadingId}_${Date.now()}.webp`;
                const filePath = `task_photos/${fileName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('photos')
                    .upload(filePath, compressedBlob, {
                        contentType: 'image/webp',
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('photos')
                    .getPublicUrl(filePath);

                onComplete(uploadingId, publicUrl);
            } catch (error: any) {
                console.error("Upload failed details:", error);

                let errorMessage = "Upload failed. ";
                if (error.message) errorMessage += error.message;

                alert(`${errorMessage}\n\nCheck if: \n1. Bucket 'photos' is set to PUBLIC. \n2. RLS policies allow INSERT/UPDATE on storage.objects.`);
            } finally {
                setIsUploading(false);
                setUploadingId(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
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
                                    initial={{ opacity: 0, y: 30, rotate: (index % 7 - 3) * 0.2 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (Math.floor(index / 2) % 5) * 0.1 + (index % 2 === 0 ? 0 : 0.15) }}
                                    animate={{ rotate: (index % 7 - 3) * 0.2 }}
                                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 1 : -1 }}
                                    className="relative w-full max-w-[420px] transition-all duration-500"
                                >
                                    {/* Polaroid Card */}
                                    <div className="bg-[#fdfdfd] shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-4 md:p-5 pb-8 md:pb-12 flex flex-col group relative overflow-hidden border border-zinc-100/50 rounded-sm">

                                        {/* Paper Texture */}
                                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                                        <div className="flex flex-col h-full">
                                            {/* Photo Area */}
                                            <div className="relative w-full aspect-square bg-[#332e2e] overflow-hidden shadow-inner flex items-center justify-center">
                                                <AnimatePresence mode="wait">
                                                    {isUploading && uploadingId === item.id ? (
                                                        <motion.div
                                                            key="loading"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex flex-col items-center gap-2"
                                                        >
                                                            <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                                                            <span className="text-[10px] font-sans text-white/30 uppercase tracking-widest">Uploading...</span>
                                                        </motion.div>
                                                    ) : item.photoUrl ? (
                                                        <motion.img
                                                            key="photo"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            src={item.photoUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <motion.div
                                                            key="placeholder"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="w-full h-full flex items-center justify-center p-8 text-center cursor-pointer"
                                                            onClick={() => handleUploadClick(item.id)}
                                                        >
                                                            <span className="text-xs font-sans tracking-tight text-white/20 uppercase group-hover:text-white/40 transition-colors">upload photo here</span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none opacity-40" />
                                            </div>

                                            {/* Title Area */}
                                            <div className="mt-8 md:mt-12 flex-1 flex items-center justify-center text-center px-4">
                                                <h3
                                                    className="text-xl md:text-2xl font-indie leading-tight break-words"
                                                    style={{ color: themeColor }}
                                                >
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Completion Checkmark */}
                                        {item.completed && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -20 }}
                                                animate={{ scale: 1, rotate: -15 }}
                                                className="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center z-20 shadow-sm border-2"
                                                style={{
                                                    backgroundColor: themeColor + '33',
                                                    borderColor: themeColor + '4D',
                                                    color: themeColor
                                                }}
                                            >
                                                <CheckCircle2 className="w-6 h-6" />
                                            </motion.div>
                                        )}

                                        <button
                                            onClick={() => handleUploadClick(item.id)}
                                            className="absolute inset-0 w-full h-full z-40 opacity-0 cursor-pointer"
                                        />
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
                className="mt-20 md:mt-60 pt-12 pb-10 text-center relative"
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
