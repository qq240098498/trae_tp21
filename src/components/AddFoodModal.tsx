import { X } from 'lucide-react';
import { useState } from 'react';
import type { StorageLocation } from '@/types';
import { useFoodStore } from '@/store/useFoodStore';
import { getTodayString } from '@/utils/dateUtils';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFoodModal({ isOpen, onClose }: AddFoodModalProps) {
  const addItem = useFoodStore((state) => state.addItem);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('个');
  const [purchaseDate, setPurchaseDate] = useState(getTodayString());
  const [shelfLifeDays, setShelfLifeDays] = useState('7');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('refrigerator');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quantity || !shelfLifeDays) return;

    addItem({
      name: name.trim(),
      quantity: Number(quantity),
      unit: unit || '个',
      purchaseDate,
      shelfLifeDays: Number(shelfLifeDays),
      storageLocation,
    });

    setName('');
    setQuantity('1');
    setUnit('个');
    setPurchaseDate(getTodayString());
    setShelfLifeDays('7');
    setStorageLocation('refrigerator');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">添加食材</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              食材名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：牛奶、鸡蛋、苹果"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                数量
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                单位
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="个/盒/斤"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                购买日期
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                保质期（天）
              </label>
              <input
                type="number"
                min="1"
                value={shelfLifeDays}
                onChange={(e) => setShelfLifeDays(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              存放位置
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'refrigerator', label: '冷藏' },
                { value: 'freezer', label: '冷冻' },
                { value: 'room', label: '常温' },
              ].map((loc) => (
                <button
                  key={loc.value}
                  type="button"
                  onClick={() => setStorageLocation(loc.value as StorageLocation)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    storageLocation === loc.value
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !quantity || !shelfLifeDays}
            className="w-full py-3 mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
          >
            保存食材
          </button>
        </form>
      </div>
    </div>
  );
}
