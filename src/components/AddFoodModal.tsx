import { X, Plus, Search, BookmarkPlus, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { StorageLocation, FoodCategory, FoodTemplate, CategoryFilterType } from '@/types';
import { useFoodStore } from '@/store/useFoodStore';
import { getTodayString } from '@/utils/dateUtils';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTemplates: () => void;
}

const categoryOptions: { value: FoodCategory; label: string; emoji: string }[] = [
  { value: 'vegetable', label: '蔬菜', emoji: '🥬' },
  { value: 'fruit', label: '水果', emoji: '🍎' },
  { value: 'meat', label: '肉类', emoji: '🥩' },
  { value: 'condiment', label: '调味品', emoji: '🧂' },
  { value: 'beverage', label: '饮料', emoji: '🥤' },
  { value: 'snack', label: '零食', emoji: '🍪' },
  { value: 'other', label: '其他', emoji: '📦' },
];

const locationOptions: { value: StorageLocation; label: string }[] = [
  { value: 'refrigerator', label: '冷藏' },
  { value: 'freezer', label: '冷冻' },
  { value: 'room', label: '常温' },
];

export function AddFoodModal({ isOpen, onClose, onOpenTemplates }: AddFoodModalProps) {
  const addItem = useFoodStore((state) => state.addItem);
  const templates = useFoodStore((state) => state.templates);
  const addItemFromTemplate = useFoodStore((state) => state.addItemFromTemplate);
  const addTemplate = useFoodStore((state) => state.addTemplate);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('个');
  const [purchaseDate, setPurchaseDate] = useState(getTodayString());
  const [shelfLifeDays, setShelfLifeDays] = useState('7');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('refrigerator');
  const [category, setCategory] = useState<FoodCategory>('other');
  const [templateFilter, setTemplateFilter] = useState<CategoryFilterType>('all');
  const [templateSearch, setTemplateSearch] = useState('');
  const [showTemplateSaved, setShowTemplateSaved] = useState(false);

  const resetForm = () => {
    setName('');
    setQuantity('1');
    setUnit('个');
    setPurchaseDate(getTodayString());
    setShelfLifeDays('7');
    setStorageLocation('refrigerator');
    setCategory('other');
  };

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
      category,
    });

    resetForm();
    onClose();
  };

  const handleApplyTemplate = (template: FoodTemplate) => {
    setName(template.name);
    setUnit(template.unit);
    setShelfLifeDays(String(template.shelfLifeDays));
    setStorageLocation(template.storageLocation);
    setCategory(template.category);
  };

  const handleQuickAddFromTemplate = (template: FoodTemplate) => {
    addItemFromTemplate(template.id, 1);
    onClose();
  };

  const handleSaveAsTemplate = () => {
    if (!name.trim() || !shelfLifeDays) return;

    addTemplate({
      name: name.trim(),
      unit: unit || '个',
      shelfLifeDays: Number(shelfLifeDays),
      storageLocation,
      category,
    });

    setShowTemplateSaved(true);
    setTimeout(() => setShowTemplateSaved(false), 2000);
  };

  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (templateFilter !== 'all') {
      result = result.filter((t) => t.category === templateFilter);
    }
    if (templateSearch.trim()) {
      const q = templateSearch.toLowerCase().trim();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    return result;
  }, [templates, templateFilter, templateSearch]);

  const groupedTemplates = useMemo(() => {
    if (templateFilter !== 'all') {
      const meta = categoryOptions.find((c) => c.value === templateFilter);
      return meta ? [{ ...meta, items: filteredTemplates }] : [];
    }
    return categoryOptions
      .map((meta) => ({
        ...meta,
        items: filteredTemplates.filter((t) => t.category === meta.value),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredTemplates, templateFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slideUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">添加食材</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {templates.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                常用模板
              </label>
              <button
                type="button"
                onClick={onOpenTemplates}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                管理模板
              </button>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="搜索模板名称..."
                className="w-full pl-9 pr-9 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
              />
              {templateSearch && (
                <button
                  type="button"
                  onClick={() => setTemplateSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide mb-3">
              <button
                type="button"
                onClick={() => setTemplateFilter('all')}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  templateFilter === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {categoryOptions.map((cat) => {
                const hasTemplates = templates.some((t) => t.category === cat.value);
                if (!hasTemplates) return null;
                return (
                  <button
                    type="button"
                    key={cat.value}
                    onClick={() => setTemplateFilter(cat.value)}
                    className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      templateFilter === cat.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-xs">{cat.emoji}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">没有匹配的模板</p>
                </div>
              ) : (
                groupedTemplates.map((group) => (
                  <div key={group.value}>
                    {templateFilter === 'all' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-xs">{group.emoji}</span>
                        <span className="text-xs font-semibold text-gray-500">{group.label}</span>
                        <span className="text-xs text-gray-400">({group.items.length})</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      {group.items.map((template) => {
                        const locationLabel = locationOptions.find(
                          (l) => l.value === template.storageLocation
                        )?.label || '常温';
                        const categoryMeta = categoryOptions.find(
                          (c) => c.value === template.category
                        );
                        return (
                          <div
                            key={template.id}
                            className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors group/template"
                          >
                            <button
                              type="button"
                              onClick={() => handleApplyTemplate(template)}
                              className="flex-1 min-w-0 text-left"
                              title="点击填入表单"
                            >
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm">{categoryMeta?.emoji}</span>
                                <span className="font-semibold text-gray-800 text-sm truncate">
                                  {template.name}
                                </span>
                                <span className="text-xs text-gray-400 shrink-0">
                                  {template.unit}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="text-gray-600">
                                  {template.name}-保质期{template.shelfLifeDays}天
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-gray-200/60 text-gray-600">
                                  {locationLabel}
                                </span>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickAddFromTemplate(template)}
                              className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                              title="一键添加"
                            >
                              <Plus size={14} />
                              添加
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">点击模板卡片填入表单，点击「+添加」一键录入</p>
          </div>
        )}

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
              食材类别
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    category === cat.value
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
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

          <div className="relative">
            <button
              type="submit"
              disabled={!name.trim() || !quantity || !shelfLifeDays}
              className="w-full py-3 mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
            >
              保存食材
            </button>
            <button
              type="button"
              onClick={handleSaveAsTemplate}
              disabled={!name.trim() || !shelfLifeDays}
              className="w-full py-3 mt-3 flex items-center justify-center gap-2 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showTemplateSaved ? (
                <>
                  <Check size={18} />
                  已保存为模板
                </>
              ) : (
                <>
                  <BookmarkPlus size={18} />
                  保存为常用模板
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
