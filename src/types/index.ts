export type StorageLocation = 'refrigerator' | 'freezer' | 'room';

export type ExpiryStatus = 'normal' | 'warning' | 'danger' | 'expired';

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  shelfLifeDays: number;
  storageLocation: StorageLocation;
  createdAt: string;
}

export type FilterType = StorageLocation | 'all';
