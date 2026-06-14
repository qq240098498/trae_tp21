import { Utensils, Snowflake, Sun, LayoutGrid } from 'lucide-react';
import type { FilterType, StorageLocation } from '@/types';
import { useFoodStore } from '@/store/useFoodStore';

const filterOptions: { value: FilterType; label: string; icon: typeof LayoutGrid }[] = [
  { value: 'all', label: '全部', icon: LayoutGrid },
  { value: 'refrigerator', label: '冷藏', icon: Utensils },
  { value: 'freezer', label: '冷冻', icon: Snowflake },
  { value: 'room', label: '常温', icon: Sun },
];

export function FilterTabs() {
  const filter = useFoodStore((state) => state.filter);
  const setFilter = useFoodStore((state) => state.setFilter);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filterOptions.map((option) => {
        const Icon = option.icon;
        const isActive = filter === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-100'
            }`}
          >
            <Icon size={16} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
