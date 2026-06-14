import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FoodItem, FilterType, FoodTemplate, CategoryFilterType } from '@/types';
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
      category: 'beverage',
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
      category: 'fruit',
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
      category: 'other',
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
      category: 'other',
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
      category: 'meat',
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
      category: 'beverage',
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
      category: 'fruit',
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
      category: 'snack',
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
      category: 'fruit',
      createdAt: new Date().toISOString(),
    },
  ];
}

function getMockTemplates(): FoodTemplate[] {
  return [
    {
      id: generateId(),
      name: '牛奶',
      unit: '盒',
      shelfLifeDays: 7,
      storageLocation: 'refrigerator',
      category: 'beverage',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '鸡蛋',
      unit: '个',
      shelfLifeDays: 15,
      storageLocation: 'refrigerator',
      category: 'other',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '苹果',
      unit: '个',
      shelfLifeDays: 10,
      storageLocation: 'room',
      category: 'fruit',
      createdAt: new Date().toISOString(),
    },
  ];
}

interface FoodStore {
  items: FoodItem[];
  templates: FoodTemplate[];
  filter: FilterType;
  categoryFilter: CategoryFilterType;
  searchQuery: string;
  addItem: (item: Omit<FoodItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  consumeItem: (id: string, amount: number) => void;
  setFilter: (filter: FilterType) => void;
  setCategoryFilter: (filter: CategoryFilterType) => void;
  setSearchQuery: (query: string) => void;
  addTemplate: (template: Omit<FoodTemplate, 'id' | 'createdAt'>) => void;
  removeTemplate: (id: string) => void;
  addItemFromTemplate: (templateId: string, quantity: number) => void;
  initMockData: () => void;
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set, get) => ({
      items: [],
      templates: [],
      filter: 'all',
      categoryFilter: 'all',
      searchQuery: '',

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

      setCategoryFilter: (categoryFilter) => {
        set({ categoryFilter });
      },

      setSearchQuery: (searchQuery) => {
        set({ searchQuery });
      },

      addTemplate: (template) => {
        const newTemplate: FoodTemplate = {
          ...template,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ templates: [...state.templates, newTemplate] }));
      },

      removeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      addItemFromTemplate: (templateId, quantity) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) return;

        const newItem: FoodItem = {
          id: generateId(),
          name: template.name,
          quantity,
          unit: template.unit,
          purchaseDate: getTodayString(),
          shelfLifeDays: template.shelfLifeDays,
          storageLocation: template.storageLocation,
          category: template.category,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      initMockData: () => {
        const { items, templates } = get();
        if (items.length === 0) {
          set({ items: getMockItems() });
        }
        if (templates.length === 0) {
          set({ templates: getMockTemplates() });
        }
      },
    }),
    {
      name: 'fridge-food-items',
    }
  )
);
