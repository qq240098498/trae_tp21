import { useMemo } from 'react';
import { useFoodStore } from '@/store/useFoodStore';
import { getDaysRemaining, getExpiryStatus } from '@/utils/dateUtils';

export function useFilteredItems() {
  const items = useFoodStore((state) => state.items);
  const filter = useFoodStore((state) => state.filter);

  return useMemo(() => {
    let filtered = items;

    if (filter !== 'all') {
      filtered = items.filter((item) => item.storageLocation === filter);
    }

    return filtered.sort((a, b) => {
      const daysA = getDaysRemaining(a);
      const daysB = getDaysRemaining(b);
      if (daysA !== daysB) return daysA - daysB;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [items, filter]);
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
