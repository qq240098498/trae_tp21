import { useState, useEffect } from 'react';
import { Refrigerator, AlertTriangle, ChefHat, Sparkles, Bookmark } from 'lucide-react';
import { useGroupedItems, useStats } from '@/hooks/useFoodItems';
import { useFoodStore } from '@/store/useFoodStore';
import { StatsBar } from '@/components/StatsBar';
import { FilterTabs } from '@/components/FilterTabs';
import { CategoryTabs } from '@/components/CategoryTabs';
import { SearchBar } from '@/components/SearchBar';
import { FoodCard } from '@/components/FoodCard';
import { AddFoodModal } from '@/components/AddFoodModal';
import { TemplateModal } from '@/components/TemplateModal';
import { FloatingButton } from '@/components/FloatingButton';

export default function Home() {
  const groups = useGroupedItems();
  const stats = useStats();
  const initMockData = useFoodStore((state) => state.initMockData);
  const totalItems = useFoodStore((state) => state.items.length);
  const searchQuery = useFoodStore((state) => state.searchQuery);
  const categoryFilter = useFoodStore((state) => state.categoryFilter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const totalFilteredItems = groups.reduce((sum, g) => sum + g.items.length, 0);

  useEffect(() => {
    if (stats.danger > 0 || stats.expired > 0) {
      setShowReminder(true);
      const timer = setTimeout(() => setShowReminder(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [stats.danger, stats.expired]);

  const handleOpenTemplates = () => {
    setIsModalOpen(false);
    setIsTemplateModalOpen(true);
  };

  const hasActiveFilters = searchQuery.trim() || categoryFilter !== 'all';

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Refrigerator className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">我的冰箱</h1>
              <p className="text-sm text-gray-500">管理食材，新鲜每一天</p>
            </div>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
            title="常用食材模板"
          >
            <Bookmark size={20} />
          </button>
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
          <SearchBar />
        </div>

        <div className="mb-4">
          <FilterTabs />
        </div>

        <div className="mb-4">
          <CategoryTabs />
        </div>

        {hasActiveFilters && totalFilteredItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ChefHat className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">没有找到匹配的食材</h3>
            <p className="text-sm text-gray-500">试试调整搜索条件或分类筛选</p>
          </div>
        ) : totalFilteredItems === 0 ? (
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
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{group.emoji}</span>
                  <h2 className="text-base font-bold text-gray-700">{group.label}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                    {group.items.length} 项
                  </span>
                </div>
                <div className="space-y-3">
                  {group.items.map((item, index) => (
                    <FoodCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpenTemplates={handleOpenTemplates}
      />
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
}
