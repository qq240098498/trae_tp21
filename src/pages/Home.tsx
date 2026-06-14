import { useState, useEffect } from 'react';
import { Refrigerator, AlertTriangle, ChefHat, Sparkles } from 'lucide-react';
import { useFilteredItems, useStats } from '@/hooks/useFoodItems';
import { useFoodStore } from '@/store/useFoodStore';
import { StatsBar } from '@/components/StatsBar';
import { FilterTabs } from '@/components/FilterTabs';
import { FoodCard } from '@/components/FoodCard';
import { AddFoodModal } from '@/components/AddFoodModal';
import { FloatingButton } from '@/components/FloatingButton';

export default function Home() {
  const items = useFilteredItems();
  const stats = useStats();
  const initMockData = useFoodStore((state) => state.initMockData);
  const totalItems = useFoodStore((state) => state.items.length);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (stats.danger > 0 || stats.expired > 0) {
      setShowReminder(true);
      const timer = setTimeout(() => setShowReminder(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [stats.danger, stats.expired]);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Refrigerator className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">我的冰箱</h1>
            <p className="text-sm text-gray-500">管理食材，新鲜每一天</p>
          </div>
        </div>

        {showReminder && (stats.danger > 0 || stats.expired > 0) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fadeIn">
            <AlertTriangle className="text-red-500 shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">
                {stats.expired > 0 && `有 ${stats.expired} 种食材已过期`}
                {stats.expired > 0 && stats.danger > 0 && '，'}
                {stats.danger > 0 && `有 ${stats.danger} 种食材将在3天内过期`}
                ，请尽快处理！
              </p>
            </div>
            <button
              onClick={() => setShowReminder(false)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              知道了
            </button>
          </div>
        )}

        <div className="mb-6">
          <StatsBar />
        </div>

        <div className="mb-4">
          <FilterTabs />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <ChefHat className="text-emerald-400" size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">冰箱空空如也</h3>
            <p className="text-sm text-gray-500 mb-6">点击右下角按钮添加食材吧</p>
            {totalItems === 0 && (
              <button
                onClick={initMockData}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-200"
              >
                <Sparkles size={18} />
                <span className="font-medium">加载示例食材</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <FoodCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>

      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <AddFoodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
