import { useState } from 'react';
import { Utensils, Snowflake, Sun, Minus, Plus, Check, X } from 'lucide-react';
import type { FoodItem, ExpiryStatus, StorageLocation, FoodCategory } from '@/types';
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

const categoryLabels: Record<FoodCategory, string> = {
  vegetable: '蔬菜',
  fruit: '水果',
  meat: '肉类',
  condiment: '调味品',
  beverage: '饮料',
  snack: '零食',
  other: '其他',
};

const categoryBadgeStyles: Record<FoodCategory, string> = {
  vegetable: 'bg-green-100 text-green-700',
  fruit: 'bg-orange-100 text-orange-700',
  meat: 'bg-red-100 text-red-700',
  condiment: 'bg-yellow-100 text-yellow-700',
  beverage: 'bg-blue-100 text-blue-700',
  snack: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

export function FoodCard({ item, index }: FoodCardProps) {
  const consumeItem = useFoodStore((state) => state.consumeItem);
  const [isEating, setIsEating] = useState(false);
  const [eatAmount, setEatAmount] = useState(1);
  const daysRemaining = getDaysRemaining(item);
  const status = getExpiryStatus(item);
  const styles = statusStyles[status];
  const LocationIcon = locationIcons[item.storageLocation];
  const categoryBadgeStyle = categoryBadgeStyles[item.category];

  const handleStartEat = () => {
    setEatAmount(1);
    setIsEating(true);
  };

  const handleCancelEat = () => {
    setIsEating(false);
  };

  const handleConfirmEat = () => {
    consumeItem(item.id, eatAmount);
    setIsEating(false);
  };

  const handleEatAll = () => {
    consumeItem(item.id, item.quantity);
    setIsEating(false);
  };

  const decreaseAmount = () => {
    if (eatAmount > 1) {
      setEatAmount(eatAmount - 1);
    }
  };

  const increaseAmount = () => {
    if (eatAmount < item.quantity) {
      setEatAmount(eatAmount + 1);
    }
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
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-gray-800 text-lg truncate">{item.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryBadgeStyle} font-medium shrink-0`}>
              {categoryLabels[item.category]}
            </span>
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

        {!isEating ? (
          <button
            onClick={handleStartEat}
            className="shrink-0 flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 transition-all duration-200 min-w-[60px]"
            title="吃掉一些"
          >
            <Utensils size={18} />
            <span className="text-xs font-medium">吃掉</span>
          </button>
        ) : (
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={decreaseAmount}
                disabled={eatAmount <= 1}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-semibold text-gray-700 text-sm">
                {eatAmount}
              </span>
              <button
                onClick={increaseAmount}
                disabled={eatAmount >= item.quantity}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleCancelEat}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
              >
                <X size={14} />
              </button>
              <button
                onClick={handleConfirmEat}
                className="flex-1 h-8 flex items-center justify-center gap-1 px-3 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-xs font-medium"
              >
                <Check size={14} />
                确认
              </button>
            </div>
            <button
              onClick={handleEatAll}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              全部吃完
            </button>
          </div>
        )}
      </div>

      {status === 'danger' && (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}
