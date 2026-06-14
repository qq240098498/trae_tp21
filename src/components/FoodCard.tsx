import { Utensils, Snowflake, Sun, Trash2 } from 'lucide-react';
import type { FoodItem, ExpiryStatus, StorageLocation } from '@/types';
import { getDaysRemaining, getExpiryStatus, formatDate } from '@/utils/dateUtils';
import { useFoodStore } from '@/store/useFoodStore';

interface FoodCardProps {
  item: FoodItem;
  index: number;
}

const statusStyles: Record<ExpiryStatus, { border: string; bg: string; text: string; badge: string }> = {
  normal: {
    border: 'border-l-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  warning: {
    border: 'border-l-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  danger: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
  },
  expired: {
    border: 'border-l-gray-400',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    badge: 'bg-gray-200 text-gray-600',
  },
};

const locationIcons: Record<StorageLocation, typeof Utensils> = {
  refrigerator: Utensils,
  freezer: Snowflake,
  room: Sun,
};

const locationLabels: Record<StorageLocation, string> = {
  refrigerator: '冷藏',
  freezer: '冷冻',
  room: '常温',
};

export function FoodCard({ item, index }: FoodCardProps) {
  const removeItem = useFoodStore((state) => state.removeItem);
  const daysRemaining = getDaysRemaining(item);
  const status = getExpiryStatus(item);
  const styles = statusStyles[status];
  const LocationIcon = locationIcons[item.storageLocation];

  const handleEat = () => {
    removeItem(item.id);
  };

  const getStatusText = () => {
    if (status === 'expired') return '已过期';
    if (status === 'danger') return `剩 ${daysRemaining} 天`;
    if (status === 'warning') return `剩 ${daysRemaining} 天`;
    return `剩 ${daysRemaining} 天`;
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border-l-4 ${styles.border} p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fadeIn`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800 text-lg truncate">{item.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${styles.badge} font-medium shrink-0`}>
              {getStatusText()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-700">{item.quantity}</span>
              <span>{item.unit}</span>
            </span>
            <span className="flex items-center gap-1">
              <LocationIcon size={14} />
              <span>{locationLabels[item.storageLocation]}</span>
            </span>
          </div>

          <div className="text-xs text-gray-400">
            购买日期：{formatDate(item.purchaseDate)}
          </div>
        </div>

        <button
          onClick={handleEat}
          className="shrink-0 flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 transition-all duration-200 min-w-[60px]"
          title="标记为已吃完"
        >
          <Trash2 size={18} />
          <span className="text-xs font-medium">已吃完</span>
        </button>
      </div>

      {status === 'danger' && (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}
