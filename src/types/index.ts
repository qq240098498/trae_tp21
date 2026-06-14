export type StorageLocation = 'refrigerator' | 'freezer' | 'room';

export type ExpiryStatus = 'normal' | 'warning' | 'danger' | 'expired';

export type FoodCategory = 'vegetable' | 'fruit' | 'meat' | 'condiment' | 'beverage' | 'snack' | 'other';

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  shelfLifeDays: number;
  storageLocation: StorageLocation;
  category: FoodCategory;
  createdAt: string;
}

export interface FoodTemplate {
  id: string;
  name: string;
  unit: string;
  shelfLifeDays: number;
  storageLocation: StorageLocation;
  category: FoodCategory;
  createdAt: string;
}

export type FilterType = StorageLocation | 'all';
export type CategoryFilterType = FoodCategory | 'all';
