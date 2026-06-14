import type { FoodItem, ExpiryStatus } from '@/types';

export function getDaysRemaining(item: FoodItem): number {
  const purchaseDate = new Date(item.purchaseDate);
  const expiryDate = new Date(purchaseDate);
  expiryDate.setDate(purchaseDate.getDate() + item.shelfLifeDays);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function getExpiryStatus(item: FoodItem): ExpiryStatus {
  const daysRemaining = getDaysRemaining(item);
  
  if (daysRemaining <= 0) return 'expired';
  if (daysRemaining <= 3) return 'danger';
  if (daysRemaining <= 7) return 'warning';
  return 'normal';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return formatDate(new Date().toISOString());
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
