import { Carrot, Apple, Beef, FlaskConical, Coffee, Cookie, LayoutGrid } from 'lucide-react';
import type { CategoryFilterType } from '@/types';
import { useFoodStore } from '@/store/useFoodStore';
import { useCategoryCounts } from '@/hooks/useFoodItems';

const categoryOptions: { value: CategoryFilterType; label: string; emoji: string; icon: typeof LayoutGrid }[] = [
  { value: 'all', label: '全部', emoji: '📋', icon: LayoutGrid },
  { value: 'vegetable', label: '蔬菜', emoji: '🥬', icon: Carrot },
  { value: 'fruit', label: '水果', emoji: '🍎', icon: Apple },
  { value: 'meat', label: '肉类', emoji: '🥩', icon: Beef },
  { value: 'condiment', label: '调味品', emoji: '🧂', icon: FlaskConical },
  { value: 'beverage', label: '饮料', emoji: '🥤', icon: Coffee },
  { value: 'snack', label: '零食', emoji: '🍪', icon: Cookie },
];

export function CategoryTabs() {
  const categoryFilter = useFoodStore((state) => state.categoryFilter);
  const setCategoryFilter = useFoodStore((state) => state.setCategoryFilter);
  const counts = useCategoryCounts();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categoryOptions.map((option) => {
        const Icon = option.icon;
        const isActive = categoryFilter === option.value;
        const count = option.value === 'all'
          ? Object.values(counts).reduce((sum, c) => sum + (c || 0), 0)
          : counts[option.value] || 0;

        return (
          <button
            key={option.value}
            onClick={() => setCategoryFilter(option.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-100'
            }`}
          >
            <Icon size={16} />
            {option.label}
            {count > 0 && (
              <span
                className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-semibold min-w-[20px] text-center ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
