import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FoodItem, FilterType } from '@/types';
import { generateId, getTodayString } from '@/utils/dateUtils';

function getMockItems(): FoodItem[] {
  const today = new Date();
  const daysAgo = (days: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: generateId(),
      name: '鲜牛奶',
      quantity: 2,
      unit: '盒',
      purchaseDate: daysAgo(3),
      shelfLifeDays: 5,
      storageLocation: 'refrigerator',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '草莓',
      quantity: 1,
      unit: '盒',
      purchaseDate: daysAgo(1),
      shelfLifeDays: 3,
      storageLocation: 'refrigerator',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '鸡蛋',
      quantity: 12,
      unit: '个',
      purchaseDate: daysAgo(0),
      shelfLifeDays: 15,
      storageLocation: 'refrigerator',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '速冻饺子',
      quantity: 3,
      unit: '袋',
      purchaseDate: daysAgo(10),
      shelfLifeDays: 180,
      storageLocation: 'freezer',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '三文鱼',
      quantity: 1,
      unit: '块',
      purchaseDate: daysAgo(2),
      shelfLifeDays: 2,
      storageLocation: 'freezer',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '酸奶',
      quantity: 4,
      unit: '杯',
      purchaseDate: daysAgo(2),
      shelfLifeDays: 7,
      storageLocation: 'refrigerator',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '苹果',
      quantity: 6,
      unit: '个',
      purchaseDate: daysAgo(3),
      shelfLifeDays: 10,
      storageLocation: 'room',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '面包',
      quantity: 1,
      unit: '袋',
      purchaseDate: daysAgo(4),
      shelfLifeDays: 5,
      storageLocation: 'room',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '香蕉',
      quantity: 5,
      unit: '根',
      purchaseDate: daysAgo(1),
      shelfLifeDays: 5,
      storageLocation: 'room',
      createdAt: new Date().toISOString(),
    },
  ];
}

interface FoodStore {
  items: FoodItem[];
  filter: FilterType;
  addItem: (item: Omit<FoodItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  consumeItem: (id: string, amount: number) => void;
  setFilter: (filter: FilterType) => void;
  initMockData: () => void;
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set, get) => ({
      items: [],
      filter: 'all',

      addItem: (item) => {
        const newItem: FoodItem = {
          ...item,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      consumeItem: (id, amount) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id !== id) return item;
              const newQuantity = item.quantity - amount;
              return { ...item, quantity: newQuantity };
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      setFilter: (filter) => {
        set({ filter });
      },

      initMockData: () => {
        const { items } = get();
        if (items.length === 0) {
          set({ items: getMockItems() });
        }
      },
    }),
    {
      name: 'fridge-food-items',
    }
  )
);
