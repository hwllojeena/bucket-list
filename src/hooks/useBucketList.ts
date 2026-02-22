'use client';

import { useState, useEffect } from 'react';
import { BucketListItem } from '@/components/BucketList';
import { getItems, saveItems, getVouchers, saveVouchers } from '@/utils/db';

const INITIAL_ITEMS: BucketListItem[] = [
    { id: 1, title: "Go on a Stargazing Date", completed: false },
    { id: 2, title: "Take a Cooking Class Together", completed: false },
    { id: 3, title: "Watch the Sunrise on a Beach", completed: false },
    { id: 4, title: "Visit a Sweet Theme Park", completed: false },
    { id: 5, title: "Have a Romantic Picnic", completed: false },
    { id: 6, title: "Take a Pottery Class", completed: false },
    { id: 7, title: "Go Ice Skating Together", completed: false },
    { id: 8, title: "Build a Cozy Blanket Fort", completed: false },
    { id: 9, title: "Go on a Spontaneous Road Trip", completed: false },
    { id: 10, title: "Dance Together under the Rain", completed: false },
    { id: 11, title: "Have a Movie Marathon", completed: false },
    { id: 12, title: "Visit a Museum or Art Gallery", completed: false },
    { id: 13, title: "Go Fruit Picking", completed: false },
    { id: 14, title: "Take a Karaoke Challenge", completed: false },
    { id: 15, title: "Bake a Cake from Scratch", completed: false },
    { id: 16, title: "Go to a Drive-in Theater", completed: false },
    { id: 17, title: "Try a New Sport Together", completed: false },
    { id: 18, title: "Have a No-Phones Dinner Date", completed: false },
    { id: 19, title: "Go to a Local Concert", completed: false },
    { id: 20, title: "Visit a Botanical Garden", completed: false },
    { id: 21, title: "Go Camping or Glamping", completed: false },
    { id: 22, title: "Take a Dance Lesson", completed: false },
    { id: 23, title: "Go to a Wine Tasting", completed: false },
    { id: 24, title: "Have a Themed Photo Shoot", completed: false },
    { id: 25, title: "Volunteer Together", completed: false },
    { id: 26, title: "Go on a Morning Hike", completed: false },
    { id: 27, title: "Try Indoor Skydiving", completed: false },
    { id: 28, title: "Take a Hot Air Balloon Ride", completed: false },
    { id: 29, title: "Go Whale Watching", completed: false },
    { id: 30, title: "Visit a Landmark Together", completed: false },
    { id: 31, title: "Write Each Other Love Letters", completed: false },
    { id: 32, title: "Go Bowling Together", completed: false },
    { id: 33, title: "Visit an Aquarium", completed: false },
    { id: 34, title: "Go to a Comedy Show", completed: false },
    { id: 35, title: "Have a Game Night", completed: false },
    { id: 36, title: "Take a DIY Workshop", completed: false },
    { id: 37, title: "Go to a High Tea", completed: false },
    { id: 38, title: "Try a New Cuisine", completed: false },
    { id: 39, title: "Go for a Sunset Boat Ride", completed: false },
    { id: 40, title: "Have a Rooftop Dinner", completed: false },
    { id: 41, title: "Go to a Flea Market", completed: false },
    { id: 42, title: "Take a Professional Photo Class", completed: false },
    { id: 43, title: "Visit a Castle or Historic Site", completed: false },
    { id: 44, title: "Go Ice-Cream Tasting", completed: false },
    { id: 45, title: "Have a Spa Day at Home", completed: false },
    { id: 46, title: "Make a Scrapbook Together", completed: false },
    { id: 47, title: "Go Bird Watching", completed: false },
    { id: 48, title: "Take a Train Trip", completed: false },
    { id: 49, title: "Have a Breakfast in Bed", completed: false },
    { id: 50, title: "Plan Your Next Big Travel", completed: false },
];

export function useBucketList() {
    const [items, setItems] = useState<BucketListItem[]>(INITIAL_ITEMS);
    const [completedVoucherIds, setCompletedVoucherIds] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const saved = await getItems();
                if (saved && saved.length > 0) {
                    setItems(saved);
                }
                const savedVouchers = await getVouchers();
                if (savedVouchers && savedVouchers.length > 0) {
                    setCompletedVoucherIds(savedVouchers.map(v => v.id));
                }
            } catch (e) {
                console.error("Failed to load bucket list from IndexedDB", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadItems();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            saveItems(items).catch(e => console.error("Failed to save to IndexedDB", e));
            saveVouchers(completedVoucherIds.map(id => ({ id }))).catch(e => console.error("Failed to save vouchers to IndexedDB", e));
        }
    }, [items, isLoaded]);

    const handleComplete = (id: number, photoUrl: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, completed: true, photoUrl } : item
        ));
    };

    const handleCompleteVoucher = (id: number) => {
        setCompletedVoucherIds(prev =>
            prev.includes(id) ? prev : [...prev, id]
        );
    };

    const completedCount = items.filter(item => item.completed).length;
    const currentMilestoneIndex = Math.min(Math.floor(completedCount / 5), 9);

    const itemsWithLock = items.map((item, index) => ({
        ...item,
        locked: Math.floor(index / 5) > currentMilestoneIndex
    }));

    const isCurrentMilestoneCompleted = items
        .slice(currentMilestoneIndex * 5, (currentMilestoneIndex + 1) * 5)
        .every(i => i.completed);

    return {
        items: itemsWithLock,
        completedCount,
        currentMilestone: currentMilestoneIndex,
        isCurrentMilestoneCompleted,
        completedVoucherIds,
        handleComplete,
        handleCompleteVoucher,
        isLoaded
    };
}
