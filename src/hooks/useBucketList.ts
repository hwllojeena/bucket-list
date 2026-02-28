'use client';

import { useState, useEffect } from 'react';
import { BucketListItem } from '@/components/SequentialBucketList';
import { supabase } from '@/lib/supabase';

export interface Tenant {
    id: string;
    slug: string;
    lock_text: string;
    hint: string;
    passcode: string;
    color_theme: string;
    heading_text: string;
    subheading_text: string;
    progress_text: string;
}

export function useBucketList(slug: string | string[]) {
    const [items, setItems] = useState<BucketListItem[]>([]);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const loadData = async () => {
            try {
                // 1. Fetch Tenant
                const { data: tenantData, error: tenantError } = await supabase
                    .from('tenants')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (tenantError) throw tenantError;
                setTenant(tenantData);

                // 2. Fetch Tasks
                const { data: tasksData, error: tasksError } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('tenant_id', tenantData.id)
                    .order('order_index', { ascending: true });

                if (tasksError) throw tasksError;

                // Map DB tasks to BucketListItem interface
                const mappedItems: BucketListItem[] = (tasksData || []).map(t => ({
                    id: t.id, // Using UUID from DB
                    dbId: t.id, // Keep track of DB ID
                    title: t.title,
                    completed: t.completed,
                    photoUrl: t.photo_url
                }));

                setItems(mappedItems);
            } catch (e: any) {
                console.error("Failed to load data from Supabase", e);
                setError(e.message);
            } finally {
                setIsLoaded(true);
            }
        };

        loadData();
    }, [slug]);

    const handleComplete = async (id: string | number, photoUrl: string) => {
        // Optimistic update
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, completed: true, photoUrl } : item
        ));

        // Persist to Supabase
        const { error } = await supabase
            .from('tasks')
            .update({ completed: true, photo_url: photoUrl })
            .eq('id', id);

        if (error) {
            console.error("Failed to update task", error);
            // Revert on error if needed
        }
    };

    const completedCount = items.filter(item => item.completed).length;

    return {
        items,
        tenant,
        completedCount,
        totalCount: items.length,
        handleComplete,
        isLoaded,
        error
    };
}
