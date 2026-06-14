import { useMemo } from 'react';
import { useFoodStore } from '@/store/useFoodStore';
import { getDaysRemaining, getExpiryStatus } from '@/utils/dateUtils';
import type { FoodItem, FoodCategory } from '@/types';

export interface CategoryGroup {
  category: FoodCategory;
  label: string;
  emoji: string;
  items: FoodItem[];
}

const categoryMeta: { category: FoodCategory; label: string; emoji: string }[] = [
  { category: 'vegetable', label: '蔬菜', emoji: '🥬' },
  { category: 'fruit', label: '水果', emoji: '🍎' },
  { category: 'meat', label: '肉类', emoji: '🥩' },
  { category: 'condiment', label: '调味品', emoji: '🧂' },
  { category: 'beverage', label: '饮料', emoji: '🥤' },
  { category: 'snack', label: '零食', emoji: '🍪' },
  { category: 'other', label: '其他', emoji: '📦' },
];

export function useFilteredItems() {
  const items = useFoodStore((state) => state.items);
  const filter = useFoodStore((state) => state.filter);
  const categoryFilter = useFoodStore((state) => state.categoryFilter);
  const searchQuery = useFoodStore((state) => state.searchQuery);

  return useMemo(() => {
    let filtered = items;

    if (filter !== 'all') {
      filtered = filtered.filter((item) => item.storageLocation === filter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(query));
    }

    return filtered.sort((a, b) => {
      const daysA = getDaysRemaining(a);
      const daysB = getDaysRemaining(b);
      if (daysA !== daysB) return daysA - daysB;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [items, filter, categoryFilter, searchQuery]);
}

export function useGroupedItems() {
  const items = useFilteredItems();
  const categoryFilter = useFoodStore((state) => state.categoryFilter);

  return useMemo(() => {
    if (categoryFilter !== 'all') {
      const meta = categoryMeta.find((m) => m.category === categoryFilter);
      return meta
        ? [{ ...meta, items }]
        : [];
    }

    return categoryMeta
      .map((meta) => ({
        ...meta,
        items: items.filter((item) => item.category === meta.category),
      }))
      .filter((group) => group.items.length > 0);
  }, [items, categoryFilter]);
}

export function useCategoryCounts() {
  const items = useFoodStore((state) => state.items);

  return useMemo(() => {
    const counts: Partial<Record<FoodCategory, number>> = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);
}

export function useStats() {
  const items = useFoodStore((state) => state.items);

  return useMemo(() => {
    let danger = 0;
    let warning = 0;
    let expired = 0;

    items.forEach((item) => {
      const status = getExpiryStatus(item);
      if (status === 'expired') expired++;
      else if (status === 'danger') danger++;
      else if (status === 'warning') warning++;
    });

    return { total: items.length, danger, warning, expired };
  }, [items]);
}
