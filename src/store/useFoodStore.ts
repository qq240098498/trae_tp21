import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FoodItem, FilterType, FoodTemplate, CategoryFilterType, ShoppingListItem, SupermarketAisle, FoodCategory } from '@/types';
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

const categoryToAisle: Record<FoodCategory, SupermarketAisle> = {
  vegetable: 'fresh',
  fruit: 'fresh',
  meat: 'fresh',
  condiment: 'condiment',
  beverage: 'snack',
  snack: 'snack',
  other: 'other',
};

function getAisleFromCategory(category: FoodCategory): SupermarketAisle {
  return categoryToAisle[category];
}

interface FoodStore {
  items: FoodItem[];
  templates: FoodTemplate[];
  shoppingList: ShoppingListItem[];
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
  toggleNeedToBuy: (foodItemId: string) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, 'id' | 'addedAt' | 'aisle'> & { sourceFoodItemId?: string }) => void;
  removeFromShoppingList: (id: string) => void;
  toggleShoppingItemChecked: (id: string) => void;
  updateShoppingItemQuantity: (id: string, quantity: number) => void;
  clearCheckedItems: () => void;
  clearShoppingList: () => void;
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set, get) => ({
      items: [],
      templates: [],
      shoppingList: [],
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
          shoppingList: state.shoppingList.filter((sl) => sl.sourceFoodItemId !== id),
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

      toggleNeedToBuy: (foodItemId) => {
        const item = get().items.find((i) => i.id === foodItemId);
        if (!item) return;

        const newNeedToBuy = !item.needToBuy;

        set((state) => {
          let newShoppingList = state.shoppingList;

          if (newNeedToBuy) {
            const existingItem = state.shoppingList.find((sl) => sl.sourceFoodItemId === foodItemId);
            if (!existingItem) {
              const newShoppingItem: ShoppingListItem = {
                id: generateId(),
                name: item.name,
                quantity: item.quantity || 1,
                unit: item.unit,
                category: item.category,
                aisle: getAisleFromCategory(item.category),
                addedAt: new Date().toISOString(),
                checked: false,
                sourceFoodItemId: foodItemId,
              };
              newShoppingList = [...state.shoppingList, newShoppingItem];
            }
          } else {
            newShoppingList = state.shoppingList.filter((sl) => sl.sourceFoodItemId !== foodItemId);
          }

          return {
            items: state.items.map((i) =>
              i.id === foodItemId ? { ...i, needToBuy: newNeedToBuy } : i
            ),
            shoppingList: newShoppingList,
          };
        });
      },

      addToShoppingList: (item) => {
        const newItem: ShoppingListItem = {
          ...item,
          id: generateId(),
          aisle: getAisleFromCategory(item.category),
          addedAt: new Date().toISOString(),
        };
        set((state) => ({ shoppingList: [...state.shoppingList, newItem] }));
      },

      removeFromShoppingList: (id) => {
        const shoppingItem = get().shoppingList.find((sl) => sl.id === id);
        set((state) => {
          let newItems = state.items;
          if (shoppingItem?.sourceFoodItemId) {
            newItems = state.items.map((i) =>
              i.id === shoppingItem.sourceFoodItemId ? { ...i, needToBuy: false } : i
            );
          }
          return {
            items: newItems,
            shoppingList: state.shoppingList.filter((sl) => sl.id !== id),
          };
        });
      },

      toggleShoppingItemChecked: (id) => {
        set((state) => ({
          shoppingList: state.shoppingList.map((sl) =>
            sl.id === id ? { ...sl, checked: !sl.checked } : sl
          ),
        }));
      },

      updateShoppingItemQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromShoppingList(id);
          return;
        }
        set((state) => ({
          shoppingList: state.shoppingList.map((sl) =>
            sl.id === id ? { ...sl, quantity } : sl
          ),
        }));
      },

      clearCheckedItems: () => {
        set((state) => {
          const checkedSourceIds = state.shoppingList
            .filter((sl) => sl.checked && sl.sourceFoodItemId)
            .map((sl) => sl.sourceFoodItemId!);
          return {
            items: state.items.map((i) =>
              checkedSourceIds.includes(i.id) ? { ...i, needToBuy: false } : i
            ),
            shoppingList: state.shoppingList.filter((sl) => !sl.checked),
          };
        });
      },

      clearShoppingList: () => {
        set((state) => ({
          items: state.items.map((i) => ({ ...i, needToBuy: false })),
          shoppingList: [],
        }));
      },
    }),
    {
      name: 'fridge-food-items',
    }
  )
);
