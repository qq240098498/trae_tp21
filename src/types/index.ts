export type StorageLocation = 'refrigerator' | 'freezer' | 'room';

export type ExpiryStatus = 'normal' | 'warning' | 'danger' | 'expired';

export type FoodCategory = 'vegetable' | 'fruit' | 'meat' | 'condiment' | 'beverage' | 'snack' | 'other';

export type SupermarketAisle = 'fresh' | 'condiment' | 'snack' | 'other';

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
  needToBuy?: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  aisle: SupermarketAisle;
  addedAt: string;
  checked?: boolean;
  sourceFoodItemId?: string;
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
