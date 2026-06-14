import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Trash2,
  Carrot,
  UtensilsCrossed,
  Cookie,
  Package,
  Eraser,
  ListChecks,
} from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';
import type { ShoppingListItem, SupermarketAisle, FoodCategory } from '@/types';

const aisleMeta: Record<
  SupermarketAisle,
  { label: string; emoji: string; icon: typeof Carrot; color: string; bgColor: string; borderColor: string }
> = {
  fresh: {
    label: '生鲜区',
    emoji: '🥬',
    icon: Carrot,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  condiment: {
    label: '调味区',
    emoji: '🧂',
    icon: UtensilsCrossed,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  snack: {
    label: '零食区',
    emoji: '🍪',
    icon: Cookie,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  other: {
    label: '其他区',
    emoji: '📦',
    icon: Package,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

const aisleOrder: SupermarketAisle[] = ['fresh', 'condiment', 'snack', 'other'];

const categoryLabels: Record<FoodCategory, string> = {
  vegetable: '蔬菜',
  fruit: '水果',
  meat: '肉类',
  condiment: '调味品',
  beverage: '饮料',
  snack: '零食',
  other: '其他',
};

interface AisleGroup {
  aisle: SupermarketAisle;
  items: ShoppingListItem[];
}

export default function ShoppingList() {
  const shoppingList = useFoodStore((state) => state.shoppingList);
  const toggleShoppingItemChecked = useFoodStore((state) => state.toggleShoppingItemChecked);
  const updateShoppingItemQuantity = useFoodStore((state) => state.updateShoppingItemQuantity);
  const removeFromShoppingList = useFoodStore((state) => state.removeFromShoppingList);
  const clearCheckedItems = useFoodStore((state) => state.clearCheckedItems);
  const clearShoppingList = useFoodStore((state) => state.clearShoppingList);

  const groupedItems = useMemo<AisleGroup[]>(() => {
    const groups: Record<SupermarketAisle, ShoppingListItem[]> = {
      fresh: [],
      condiment: [],
      snack: [],
      other: [],
    };

    shoppingList.forEach((item) => {
      groups[item.aisle].push(item);
    });

    return aisleOrder
      .map((aisle) => ({
        aisle,
        items: groups[aisle].sort((a, b) => {
          if (a.checked !== b.checked) return a.checked ? 1 : -1;
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [shoppingList]);

  const totalItems = shoppingList.length;
  const checkedCount = shoppingList.filter((i) => i.checked).length;
  const uncheckedCount = totalItems - checkedCount;

  const handleDecrease = (item: ShoppingListItem) => {
    updateShoppingItemQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = (item: ShoppingListItem) => {
    updateShoppingItemQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">返回</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <ShoppingCart className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">购物清单</h1>
              <p className="text-sm text-gray-500">按超市货架分类，高效购物</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-2xl font-bold text-gray-800">{totalItems}</div>
            <div className="text-xs text-gray-500 mt-0.5">总项数</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-500">{uncheckedCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">待购买</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-2xl font-bold text-emerald-500">{checkedCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">已购买</div>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={clearCheckedItems}
              disabled={checkedCount === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
            >
              <ListChecks size={18} />
              <span>清除已购买 ({checkedCount})</span>
            </button>
            <button
              onClick={clearShoppingList}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all"
            >
              <Eraser size={18} />
              <span className="hidden sm:inline">清空全部</span>
            </button>
          </div>
        )}

        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <ShoppingCart className="text-orange-400" size={52} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">购物清单是空的</h3>
            <p className="text-sm text-gray-500 mb-6">在食材卡片中点击"吃完了需要再买"</p>
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-200"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">去添加食材</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedItems.map((group) => {
              const meta = aisleMeta[group.aisle];
              const AisleIcon = meta.icon;
              return (
                <div key={group.aisle}>
                  <div
                    className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${meta.bgColor} border ${meta.borderColor}`}
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <AisleIcon className={meta.color} size={20} />
                    <h2 className={`text-base font-bold ${meta.color}`}>{meta.label}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-white ${meta.color} font-medium`}>
                      {group.items.length} 项
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl p-4 border transition-all duration-300 ${
                          item.checked
                            ? 'border-gray-200 bg-gray-50/50'
                            : 'border-gray-100 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleShoppingItemChecked(item.id)}
                            className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              item.checked
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-gray-300 hover:border-emerald-400'
                            }`}
                          >
                            {item.checked && <Check size={16} className="text-white" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold text-lg truncate ${
                                  item.checked ? 'text-gray-400 line-through' : 'text-gray-800'
                                }`}
                              >
                                {item.name}
                              </h3>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                                  item.checked
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {categoryLabels[item.category]}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
                            <button
                              onClick={() => handleDecrease(item)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                              <Minus size={14} />
                            </button>
                            <span
                              className={`w-10 text-center font-semibold text-sm ${
                                item.checked ? 'text-gray-400' : 'text-gray-700'
                              }`}
                            >
                              {item.quantity}
                              <span className="text-xs font-normal text-gray-400 ml-0.5">
                                {item.unit}
                              </span>
                            </span>
                            <button
                              onClick={() => handleIncrease(item)}
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromShoppingList(item.id)}
                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
